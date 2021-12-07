import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsService } from 'src/chats/chats.service';
import { MessageInfo } from 'src/interfaces/message-info';
import { MessageDto } from 'src/messages/dto/message-dto';
import { Message } from 'src/messages/messages.model';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message) private messageRepository: Repository<Message>,
        private chatsService: ChatsService,
        private usersService: UsersService,
    ) {}

    async addMessage(messageInfo: MessageInfo, creatorId: string, chatId: string): Promise<MessageDto> {
        const user = await this.usersService.getUserEntityById(creatorId);
        let message = this.messageRepository.create({
            isSmiling: messageInfo.isSmiling,
            text: messageInfo.text,
            chat: chatId,
            user,
        });
        message = await this.messageRepository.save(message);
        return MessagesService.buildMessageDto(message);
    }

    async readMessage(messageId: string): Promise<MessageDto> {
        let message = await this.messageRepository.findOne(messageId);
        if (!message) {
            throw new BadRequestException(`message with this id doesn't exists`);
        }
        message.isRead = true;
        message = await this.messageRepository.save(message);
        return MessagesService.buildMessageDto(message);
    }

    async getChatMessages(chatId: string): Promise<MessageDto[]> {
        const messages = await this.messageRepository.find({ relations: ['user'], where: { chat: chatId } });
        return messages.map(MessagesService.buildMessageDto);
    }

    async getChatIdByMessageId(messageId: string): Promise<string> {
        const query = `select "chatId" from messages m
                        join chats c on m."chatId" = c.id
                        where m.id = '${messageId}'`;
        const chatId: { chatId }[] = await this.messageRepository.query(query);
        return chatId[0]?.chatId;
    }

    private static buildMessageDto = (message: Message): MessageDto => {
        const { user, chat, ...messageInfo } = message;
        return {
            ...messageInfo,
            userId: user?.id,
        };
    };

}
