import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { AuthResponseDto } from 'src/auth/dto/auth-response.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('sign-in')
    async signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<AuthResponseDto> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('sign-up')
    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<AuthResponseDto> {
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('auth-me')
    async authMe(@Body('refreshToken') refreshToken: string): Promise<AuthResponseDto> {
        return this.authService.authMe(refreshToken);
    }
}
