import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
            ConfigModule,
            forwardRef(() => UsersModule),
            JwtModule.register({}),
    ],
    exports: [
        AuthService,
        JwtModule,
    ],
})
export class AuthModule {}
