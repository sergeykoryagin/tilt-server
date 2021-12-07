import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserInfoDto } from 'src/users/dto/user-info.dto';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUserInfo(@Query('userId') userId: string): Promise<UserInfoDto> {
        return this.usersService.findById(userId);
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserInfoDto> {
        return this.usersService.createUser(createUserDto);
    };

    @Get('search')
    @UseGuards(JwtAuthGuard)
    async searchUsers(
        @Query('pageSize') pageSize: number,
        @Query('pageNumber') pageNumber: number,
        @Query('searchString') searchString: string,
        @Request() request
    ): Promise<UserInfoDto[]> {
        return this.usersService.searchUsers(request.userId, searchString,{ pageNumber: +pageNumber, pageSize: +pageSize });
    }
}
