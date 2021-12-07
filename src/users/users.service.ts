import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Pagination } from 'src/interfaces/pagination';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserInfoDto } from 'src/users/dto/user-info.dto';
import { User } from 'src/users/users.model';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    async createUser({ login, password }: CreateUserDto): Promise<UserInfoDto> {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = this.userRepository.create({ login, password: hashedPassword });
        await this.userRepository.save(user);
        return UsersService.buildUserInfoDto(user);
    }

    async getUsers(): Promise<UserInfoDto[]> {
        const users = await this.userRepository.find();
        return users.map(UsersService.buildUserInfoDto);
    }

    async findById(userId: string): Promise<UserInfoDto | undefined> {
        const user = await this.userRepository.findOne(userId);
        return UsersService.buildUserInfoDto(user);
    };

    async findByLogin(login: string): Promise<UserInfoDto | undefined> {
        const user = await this.userRepository.findOne({ login });
        return UsersService.buildUserInfoDto(user);
    }

    async getUserEntityById(userId: string): Promise<User | undefined> {
        return await this.userRepository.findOne(userId);
    }

    async setCurrentRefreshToken(refreshToken: string | null, userId: string): Promise<void> {
        const currentHashedRefreshToken = refreshToken && bcrypt.hashSync(refreshToken, 10);
        await this.userRepository.update(userId, {
            currentHashedRefreshToken
        });
    }

    async searchUsers(userId: string, searchString: string, pagination: Pagination): Promise<UserInfoDto[]> {
        const users = await this.userRepository.createQueryBuilder('users')
            .where(
                `users.id != '${userId}' and LOWER(users.login) LIKE :searchString`,
                {searchString: `%${searchString.toLowerCase()}%`}
            )
            .offset((pagination.pageNumber - 1) * pagination.pageSize)
            .take(pagination.pageSize)
            .getMany();
        return users.map(UsersService.buildUserInfoDto);
    }

    async setDisconnectionTime(userId: string): Promise<void> {
        const user = await this.userRepository.findOne(userId);
        console.log(new Date().getHours());
        user.wasOnline = new Date().toISOString();
        await this.userRepository.save(user);
    };

    async validateUserPassword(login: string, password: string): Promise<UserInfoDto> {
        const user = await this.userRepository.findOne({ login });
        if (!user) {
            throw new BadRequestException(`User with this login doesn'n exists`);
        }
        const passwordAreEqual = bcrypt.compareSync(password, user.password);
        if (passwordAreEqual) {
            return UsersService.buildUserInfoDto(user);
        }
        return null;
    }

    async validateRefreshToken(refreshToken, userId): Promise<UserInfoDto> {
        const user = await this.userRepository.findOne(userId);
        if (!user) {
            throw new UnauthorizedException();
        }
        const tokensAreEqual = bcrypt.compareSync(refreshToken, user.currentHashedRefreshToken);
        if (tokensAreEqual) {
            return UsersService.buildUserInfoDto(user);
        }
        return null;
    }

    private static buildUserInfoDto(user: User): UserInfoDto {
        if (!user) {
            return null;
        }
        const { password, currentHashedRefreshToken, chats, ...userInfoDto } = user;
        return userInfoDto;
    };

}