
export class UserInfoDto {
    id: string;
    login: string;
    aboutMe?: string;
    avatar?: ArrayBuffer;
    wasOnline: string;
}