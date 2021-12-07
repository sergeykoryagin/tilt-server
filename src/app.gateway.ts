import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Chat } from 'src/chats/chats.model';
import { ChatsService } from 'src/chats/chats.service';
import { MessageInfo } from 'src/interfaces/message-info';
import { OnlineUser } from 'src/interfaces/online-user';
import { MessagesService } from 'src/messages/messages.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway(80)
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');
    private connections: WeakMap<Socket, OnlineUser> = new WeakMap<Socket, OnlineUser>();
    private connectedUsers: Map<OnlineUser['id'], Set<Socket>> = new Map<OnlineUser["id"], Set<Socket>>();

    constructor(
        private usersService: UsersService,
        @Inject(forwardRef(() => ChatsService))
        private chatsService: ChatsService,
        private messagesService: MessagesService,
    ) {};

    afterInit(server: any): void {
        this.logger.log('Initialized!');
    };

    handleConnection(client: Socket): void {
        console.log(`Client is connected: ${client.id}`);
    };

    async handleDisconnect(client: Socket): Promise<void> {
        const onlineUser = this.connections?.get(client);
        if (!onlineUser) {
            return;
        }
        this.usersService.setDisconnectionTime(onlineUser.id);
        const collocatorIds = await this.chatsService.getUserCollocators(onlineUser.id);
        collocatorIds.forEach((collocatorId: string) => {
            const collocatorClients: Set<Socket> | undefined = this.connectedUsers.get(collocatorId);
            collocatorClients?.forEach((collocatorClient: Socket): void => {
                if (collocatorClients.size === 1) {
                    collocatorClient.emit('userOffline', this.connections.get(client));
                }
            });
        });
        this.connectedUsers.get(onlineUser.id)?.delete(client);
        this.connections.delete(client);
        console.log(`Client is disconnected: ${client.id}`);
    };

    @SubscribeMessage('user')
    async handleUser(client: Socket, user: OnlineUser): Promise<void> {
        this.connections.set(client, user);
        if (this.connectedUsers.has(user.id)) {
            const userClients = this.connectedUsers.get(user.id)
            userClients.add(client);
        } else {
            const userClients = new Set<Socket>();
            userClients.add(client);
            this.connectedUsers.set(user.id, userClients);
        }
        const collocatorIds = await this.chatsService.getUserCollocators(user.id);
        collocatorIds.forEach((collocatorId: string) => {
            const collocatorClients: Set<Socket> | undefined = this.connectedUsers.get(collocatorId);
            collocatorClients?.forEach((collocatorClient: Socket): void => {
                client.emit('userOnline', this.connections.get(collocatorClient));
                collocatorClient.emit('userOnline', this.connections.get(client));
            });
        });

    };

    @SubscribeMessage('chats')
    async handleChats(client: Socket): Promise<void> {
        const onlineUser = this.connections.get(client);
        const chatIds = await this.chatsService.getUserChats(onlineUser.id);
        chatIds.forEach(async (chatId: string) => {
            const messages = await this.messagesService.getChatMessages(chatId);
            const userId = await this.chatsService.getChatCollocator(chatId, onlineUser.id);
            client.emit('chat', { userId, messages });
        });
    };

    @SubscribeMessage('message')
    async handleMessage(client: Socket, messageInfo: MessageInfo): Promise<void> {
        const onlineUser = this.connections.get(client);
        const collocatorClients = this.connectedUsers.get(messageInfo.toUserId);
        const userClients = this.connectedUsers.get(onlineUser.id);
        const chatId = await this.chatsService.getUsersChat([onlineUser.id, messageInfo.toUserId]);
        let chat: Chat;
        if (!chatId) {
            chat = await this.chatsService.createChat([onlineUser.id, messageInfo.toUserId]);
            collocatorClients?.forEach((collocatorClient): void => {
                collocatorClient.emit('chat', { userId: onlineUser.id, messages: [] });
            });
            userClients.forEach((socket): void => {
                socket.emit('chat', { userId: messageInfo.toUserId, messages: [] });
            });
        }
        const message = await this.messagesService.addMessage(messageInfo, onlineUser?.id, chatId || chat.id);
        collocatorClients?.forEach((collocatorClient): void => {
            collocatorClient.emit('message', onlineUser.id, message );
        });
        userClients.forEach((socket): void => {
            socket.emit('message',  messageInfo.toUserId, message);
        });
    };

    @SubscribeMessage('readMessage')
    async handleReadMessage(client: Socket, messageId: string): Promise<void> {
        const onlineUser = this.connections.get(client);
        const message = await this.messagesService.readMessage(messageId);

        const collocatorIds = await this.chatsService.getUserCollocators(onlineUser.id);
        collocatorIds.forEach((collocatorId: string) => {
            const collocatorClients: Set<Socket> | undefined = this.connectedUsers.get(collocatorId);
            collocatorClients?.forEach((collocatorClient: Socket): void => {
                collocatorClient.emit('readMessage', this.connections.get(client));
            });
        });
        this.connectedUsers.get(onlineUser?.id).forEach((socket): void => {
            socket.emit('readMessage', message.id, );
        });
    };
}
