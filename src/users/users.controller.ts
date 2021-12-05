import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserInfoDto } from 'src/users/dto/user-info.dto';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserInfoDto> {
        return this.usersService.createUser(createUserDto);
    };

    @Get()
    async getUsers(): Promise<UserInfoDto[]> {
        return this.usersService.getUsers();
    }
}
