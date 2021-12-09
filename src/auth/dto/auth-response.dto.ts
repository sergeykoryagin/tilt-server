import { TokenPairDto } from './token-pair.dto';
import { UserInfoDto } from '../../users/dto/user-info.dto';

export class AuthResponseDto {
    tokenPair: TokenPairDto;
    userInfo: UserInfoDto;
}