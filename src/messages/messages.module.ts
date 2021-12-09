import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModule } from '../chats/chats.module';
import { Message } from '../messages/messages.model';
import { UsersModule } from '../users/users.module';
import { MessagesService } from './messages.service';

@Module({
    providers: [MessagesService],
    imports: [TypeOrmModule.forFeature([Message]), forwardRef(() => ChatsModule), UsersModule],
    exports: [MessagesService],
})
export class MessagesModule {}
