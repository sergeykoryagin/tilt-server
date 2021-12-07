import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/chats/chats.model';
import { UsersModule } from 'src/users/users.module';
import { ChatsService } from 'src/chats/chats.service';

@Module({
  providers: [ChatsService],
  imports: [TypeOrmModule.forFeature([Chat]), UsersModule],
  exports: [ChatsService],
})
export class ChatsModule {}
