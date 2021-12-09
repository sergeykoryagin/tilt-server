import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chats.model';
import { User } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chat) private chatsRepository: Repository<Chat>,
        private usersService: UsersService,
    ) {}

    async createChat(userIds: [string, string]): Promise<Chat> {
        const chatId = await this.getUsersChat(userIds);
        if (chatId) {
            throw new BadRequestException('chats with this users already exists');
        }
        const users = await Promise.all(userIds.map(async (userId: string) => (
            this.usersService.getUserEntityById(userId)
        )));
        debugger
        const chat = this.chatsRepository.create();
        chat.members = users;
        return await this.chatsRepository.save(chat);
    }

    async getUsersChat(userIds: [string, string]): Promise<string | undefined> {
        const query = `
            select distinct cm1."chatsId" from chats_members_users cm1
            join chats_members_users cm2 on cm1."chatsId" = cm2."chatsId"
            where (cm1."usersId" = '${userIds[0]}' and cm2."usersId" = '${userIds[1]}')
            or (cm1."usersId" = '${userIds[1]}' and cm2."usersId" = '${userIds[0]}')
        `;
        const chat = await this.chatsRepository.query(query);
        return chat[0]?.chatsId;
    }

    async getUserChats (userId: string): Promise<string[]>{
        const query = `SELECT cm."chatsId" FROM chats_members_users cm
            JOIN chats c ON cm."chatsId" = c."id"
            WHERE cm."usersId" = '${userId}'`
        const chatIds: { chatsId: string }[] = await this.chatsRepository.query(query);
        return chatIds.map((chatId) => chatId.chatsId);
    };

    async getUserCollocators(userId: string): Promise<User['id'][]> {
        const query = `SELECT cm1."usersId" FROM chats_members_users cm1
            JOIN chats_members_users cm2 ON cm1."chatsId" = cm2."chatsId"
            WHERE cm2."usersId" = '${userId}' AND cm1."usersId" != '${userId}'`
        const collocators: { usersId: string }[] =  await this.chatsRepository.query(query);
        return collocators.map((collocator) => collocator.usersId);
    }

    async getChatCollocator(chatId: string, userId: string): Promise<User['id']> {
        const query = `SELECT cm."usersId" FROM chats_members_users cm
                WHERE cm."chatsId" = '${chatId}' AND cm."usersId" != '${userId}'`;
        const collocator: [ { usersId: string } ] = await this.chatsRepository.query(query);
        return collocator[0].usersId;
    }
}
