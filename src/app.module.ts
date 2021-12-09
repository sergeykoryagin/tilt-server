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
            url: `postgres://awurgvpchejrdm:ff8159ed1b2b77d36490f31d5350785a80b6325d0517954b3bb05b9ff84656b8@ec2-54-225-190-241.compute-1.amazonaws.com:5432/d39gnnc50403g7`,
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
