import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from './app.gateway';
import { Chat } from './chats/chats.model';
import { Message } from './messages/messages.model';
import { User } from './users/users.model';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [User, Chat, Message],
            synchronize: true,
            autoLoadEntities: true,
        }),
        UsersModule,
        AuthModule,
        forwardRef(() => ChatsModule),
        MessagesModule,
        StatisticsModule,
    ],
    exports: [
        ConfigModule,
    ],
    controllers: [],
    providers: [AppGateway],
})
export class AppModule {}
