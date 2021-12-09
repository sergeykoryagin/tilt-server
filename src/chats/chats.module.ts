import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chats.model';
import { UsersModule } from '../users/users.module';
import { ChatsService } from './chats.service';

@Module({
  providers: [ChatsService],
  imports: [TypeOrmModule.forFeature([Chat]), UsersModule],
  exports: [ChatsService],
})
export class ChatsModule {}
