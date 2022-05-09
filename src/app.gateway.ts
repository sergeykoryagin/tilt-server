import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import { debounce } from 'lodash';
import { Server, Socket } from 'socket.io';
import { Chat } from './chats/chats.model';
import { ChatsService } from './chats/chats.service';
import { MessageInfo } from './interfaces/message-info';
import { OnlineUser } from './interfaces/online-user';
import { MessagesService } from './messages/messages.service';
import { UsersService } from './users/users.service';

@WebSocketGateway(16000)
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');
    private connectedUsers: WeakMap<Socket, OnlineUser> = new WeakMap<Socket, OnlineUser>();
    private userConnections: Map<OnlineUser['id'], Set<Socket>> = new Map<OnlineUser["id"], Set<Socket>>();
    private debouncedSmileStoppers: Map<Socket, () => void> = new Map<Socket, () => void>();

    constructor(
        private usersService: UsersService,
        @Inject(forwardRef(() => ChatsService))
        private chatsService: ChatsService,
        private messagesService: MessagesService,
    ) {};

    afterInit(server: any): void {
        this.logger.log(`AppGateway initialized on port ${process.env.WS_PORT}`);
    };

    handleConnection(client: Socket): void {
        console.log(`Client is connected: ${client.id}`);
    };

    async handleDisconnect(client: Socket): Promise<void> {
        try {
            const onlineUser = this.connectedUsers?.get(client);
            if (!onlineUser) {
                return;
            }
            this.usersService.setDisconnectionTime(onlineUser.id);
            const collocatorIds = await this.chatsService.getUserCollocators(onlineUser.id);
            collocatorIds.forEach((collocatorId: string) => {
                const collocatorClients: Set<Socket> | undefined = this.userConnections.get(collocatorId);
                collocatorClients?.forEach((collocatorClient: Socket): void => {
                    if (collocatorClients.size === 1) {
                        collocatorClient.emit('userOffline', this.connectedUsers.get(client));
                    }
                });
            });
            this.userConnections.get(onlineUser.id)?.delete(client);
            this.connectedUsers.delete(client);
            console.log(`Client is disconnected: ${client.id}`);
        } catch (error) {
            console.log(error);
        }
    };

    @SubscribeMessage('user')
    async handleUser(client: Socket, user: OnlineUser): Promise<void> {
        try {
            this.connectedUsers.set(client, user);
            if (this.userConnections.has(user.id)) {
                const userClients = this.userConnections.get(user.id)
                userClients.add(client);
            } else {
                const userClients = new Set<Socket>();
                userClients.add(client);
                this.userConnections.set(user.id, userClients);
            }
            const collocatorIds = await this.chatsService.getUserCollocators(user.id);
            collocatorIds.forEach((collocatorId: string) => {
                const collocatorClients: Set<Socket> | undefined = this.userConnections.get(collocatorId);
                collocatorClients?.forEach((collocatorClient: Socket): void => {
                    client.emit('userOnline', this.connectedUsers.get(collocatorClient));
                    collocatorClient.emit('userOnline', this.connectedUsers.get(client));
                });
            });
        } catch (error) {
            console.log(error)
        }
    };

    @SubscribeMessage('chats')
    async handleChats(client: Socket): Promise<void> {
        try {
            const onlineUser = this.connectedUsers.get(client);
            const chatIds = await this.chatsService.getUserChats(onlineUser.id);
            chatIds.forEach(async (chatId: string) => {
                const messages = await this.messagesService.getChatMessages(chatId);
                const userId = await this.chatsService.getChatCollocator(chatId, onlineUser.id);
                client.emit('chat', {userId, messages});
            });
        } catch (error) {
            console.log(error)
        }
    };

    @SubscribeMessage('message')
    async handleMessage(client: Socket, messageInfo: MessageInfo): Promise<void> {
        try {
            const onlineUser = this.connectedUsers.get(client);
            const collocatorClients = this.userConnections.get(messageInfo.toUserId);
            const userClients = this.userConnections.get(onlineUser.id);
            const chatId = await this.chatsService.getUsersChat([onlineUser.id, messageInfo.toUserId]);
            let chat: Chat;
            if (!chatId) {
                chat = await this.chatsService.createChat([onlineUser.id, messageInfo.toUserId]);
                collocatorClients?.forEach((collocatorClient): void => {
                    collocatorClient.emit('chat', {userId: onlineUser.id, messages: []});
                });
                userClients.forEach((socket): void => {
                    socket.emit('chat', {userId: messageInfo.toUserId, messages: []});
                });
            }
            const message = await this.messagesService.addMessage(messageInfo, onlineUser?.id, chatId || chat.id);
            collocatorClients?.forEach((collocatorClient): void => {
                collocatorClient.emit('message', onlineUser.id, message);
            });
            userClients.forEach((socket): void => {
                socket.emit('message', messageInfo.toUserId, message);
            });
        } catch (error) {
            console.log(error)
        }
    };

    @SubscribeMessage('readMessage')
    async handleReadMessage(client: Socket, messageId: string): Promise<void> {
        try {
            const onlineUser = this.connectedUsers.get(client);
            await this.messagesService.readMessage(messageId);
            const chatId = await this.messagesService.getChatIdByMessageId(messageId);
            const collocatorId = await this.chatsService.getChatCollocator(chatId, onlineUser.id);

            this.userConnections.get(collocatorId).forEach((socket) => {
                socket.emit('readMessage', messageId, onlineUser.id)
            });
            this.userConnections.get(onlineUser?.id).forEach((socket): void => {
                socket.emit('readMessage', messageId, collocatorId);
            });
        } catch (error) {
            console.log(error)
        }
    };


    @SubscribeMessage('smile')
    async handleUserSmile(client: Socket, isSmiling: boolean): Promise<void> {
        try {
            const onlineUser = this.connectedUsers.get(client);
            let debouncedSmileStopper = this.debouncedSmileStoppers.get(client);
            const collocatorIds = await this.chatsService.getUserCollocators(onlineUser.id);
            if (!debouncedSmileStopper) {
                debouncedSmileStopper = debounce(() => {
                    onlineUser.isSmiling = undefined;
                    this.debouncedSmileStoppers.delete(client);
                    collocatorIds.forEach((collocatorId: string) => {
                        const collocatorClients: Set<Socket> | undefined = this.userConnections.get(collocatorId);
                        collocatorClients?.forEach((collocatorClient: Socket): void => {
                            collocatorClient.emit('userOnline', this.connectedUsers.get(client));
                        });
                    });
                }, 3000);
                this.debouncedSmileStoppers.set(client, debouncedSmileStopper);

            }
            debouncedSmileStopper();
            onlineUser.isSmiling = isSmiling;

            collocatorIds.forEach((collocatorId: string) => {
                const collocatorClients: Set<Socket> | undefined = this.userConnections.get(collocatorId);
                collocatorClients?.forEach((collocatorClient: Socket): void => {
                    collocatorClient.emit('userOnline', this.connectedUsers.get(client));
                });
            });
        } catch (error) {
            console.log(error)
        }
    }
}
