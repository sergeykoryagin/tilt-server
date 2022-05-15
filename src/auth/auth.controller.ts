import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('test')
    async test(): Promise<'test'> {
        return 'test';
    }

    @Post('sign-in')
    async signIn(
        @Body() authCredentialsDto: AuthCredentialsDto,
    ): Promise<AuthResponseDto> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('sign-up')
    async signUp(
        @Body() authCredentialsDto: AuthCredentialsDto,
    ): Promise<AuthResponseDto> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('auth-me')
    async authMe(
        @Body('refreshToken') refreshToken: string,
    ): Promise<AuthResponseDto> {
        return this.authService.authMe(refreshToken);
    }

    @Delete('sign-out')
    @UseGuards(JwtAuthGuard)
    async signOut(@Request() request): Promise<void> {
        return this.authService.signOut(request.userId);
    }

    @Put('password')
    @UseGuards(JwtAuthGuard)
    async updatePassword(
        @Body('password') password: string,
        @Request() request,
    ): Promise<void> {
        return this.authService.updatePassword(request.userId, password);
    }
}
