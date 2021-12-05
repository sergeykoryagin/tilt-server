import { TokenPairDto } from 'src/auth/dto/token-pair.dto';
import { UserInfoDto } from 'src/users/dto/user-info.dto';

export class AuthResponseDto {
    tokenPair: TokenPairDto;
    userInfo: UserInfoDto;
}