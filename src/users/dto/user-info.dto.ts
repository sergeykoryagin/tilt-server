export class UserInfoDto {
    id: string;
    login: string;
    aboutMe?: string;
    avatar?: ArrayBuffer;
    isSmiling: boolean;
    isOnline: boolean;
    wasOnline: string;
}