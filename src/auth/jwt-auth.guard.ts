import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { TokenPayload } from './interfaces/token-payload';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            const authorization = request.headers.authorization;
            const [bearer, accessToken] = authorization.split(' ');
            if (bearer !== 'Bearer' || !accessToken) {
                throw new UnauthorizedException();
            }
            const tokenPayload = this.jwtService.verify<TokenPayload>(accessToken, {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            });
            request.userId = tokenPayload.userId;
            request.login = tokenPayload.login;
            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }
}