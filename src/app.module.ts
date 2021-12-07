import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from 'src/app.gateway';
import { Chat } from 'src/chats/chats.model';
import { Message } from 'src/messages/messages.model';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatsModule } from 'src/chats/chats.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: +process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
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
