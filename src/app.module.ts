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

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            // host: process.env.POSTGRES_HOST,
            // port: +process.env.POSTGRES_PORT,
            // username: process.env.POSTGRES_USERNAME,
            // password: process.env.POSTGRES_PASSWORD,
            // database: process.env.POSTGRES_DB,
            entities: [User, Chat, Message],
            synchronize: true,
            autoLoadEntities: true,
        }),
        UsersModule,
        AuthModule,
        forwardRef(() => ChatsModule),
        MessagesModule,
    ],
    exports: [
        ConfigModule,
    ],
    controllers: [],
    providers: [AppGateway],
})
export class AppModule {}
