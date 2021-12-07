import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModule } from 'src/chats/chats.module';
import { Message } from 'src/messages/messages.model';
import { UsersModule } from 'src/users/users.module';
import { MessagesService } from 'src/messages/messages.service';

@Module({
    providers: [MessagesService],
    imports: [TypeOrmModule.forFeature([Message]), forwardRef(() => ChatsModule), UsersModule],
    exports: [MessagesService],
})
export class MessagesModule {}
