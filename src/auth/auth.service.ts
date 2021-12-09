import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { TokenPairDto } from './dto/token-pair.dto';
import { TokenPayload } from './interfaces/token-payload';
import { UserInfoDto } from '../users/dto/user-info.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signIn({ login, password }: AuthCredentialsDto): Promise<AuthResponseDto> {
        const user = await this.usersService.validateUserPassword(login, password);

        if (!user) {
            throw new BadRequestException('Invalid login or password');
        }

        const accessToken = this.createAccessToken(user.id, user.login);
        const refreshToken = this.createRefreshToken(user.id, user.login);
        await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

        const tokenPair = AuthService.buildTokenPair(accessToken, refreshToken);
        return AuthService.buildAuthResponseDto(tokenPair, user);
    }

    async signUp({ login, password }: AuthCredentialsDto): Promise<AuthResponseDto> {
        let user = await this.usersService.findByLogin(login);
        if (user) {
            throw new BadRequestException('User with this login already exists');
        }

        user = await this.usersService.createUser({ login, password });

        const accessToken = this.createAccessToken(user.id, user.login);
        const refreshToken = this.createRefreshToken(user.id, user.login);
        await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

        const tokenPair = AuthService.buildTokenPair(accessToken, refreshToken);
        return AuthService.buildAuthResponseDto(tokenPair, user);
    }

    async authMe(refreshToken: string): Promise<AuthResponseDto> {
        let tokenPayload: TokenPayload;
        try {
            tokenPayload = this.jwtService.verify<TokenPayload>(refreshToken,{
                secret: process.env.JWT_REFRESH_TOKEN_SECRET,
                maxAge: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
            });
        } catch {
            throw new UnauthorizedException();
        }
        const user = await this.usersService.validateRefreshToken(refreshToken, tokenPayload.userId);
        if (!user) {
            throw new UnauthorizedException();
        }

        const accessToken = this.createAccessToken(user.id, user.login);
        const newRefreshToken = this.createRefreshToken(user.id, user.login);
        await this.usersService.setCurrentRefreshToken(newRefreshToken, user.id);

        const tokenPair = AuthService.buildTokenPair(accessToken, newRefreshToken);
        return AuthService.buildAuthResponseDto(tokenPair, user);
    };

    async signOut(userId: string): Promise<void> {
        const user = this.usersService.findById(userId);
        if (!user) {
            throw new BadRequestException('Invalid token');
        }
        await this.usersService.setCurrentRefreshToken(null, userId);
    };

    async updatePassword(userId: string, password: string): Promise<void> {
        await this.usersService.updateUserPassword(userId, password);
    }

    private createAccessToken(userId: string, login: string): string {
        const payload: TokenPayload = { userId, login };
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        });
    }

    private createRefreshToken(userId: string, login: string): string {
        const payload: TokenPayload = { userId, login };
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        });
    }

    private static buildTokenPair = (accessToken: string, refreshToken: string): TokenPairDto => ({
        accessToken, refreshToken
    });

    private static buildAuthResponseDto = (tokenPair: TokenPairDto, userInfo: UserInfoDto): AuthResponseDto => ({
        tokenPair, userInfo
    });
}
