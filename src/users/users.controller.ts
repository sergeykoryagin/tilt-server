import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { DataSendPermissionsDto } from './dto/data-send-permissions-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UsersService } from './users.service';

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

    @Put()
    @UseGuards(JwtAuthGuard)
    async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() request) {
        return this.usersService.updateUser(request.userId, updateUserDto);
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

    @Put('avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    @UseGuards(JwtAuthGuard)
    updateUserAvatar(
        @UploadedFile() avatar: Express.Multer.File,
        @Request() request,
    ) {
        return this.usersService.updateUserAvatar(avatar, request.userId);
    }

    @Delete('avatar')
    @UseGuards(JwtAuthGuard)
    deleteUserAvatar(@Request() request) {
        return this.usersService.deleteUserAvatar(request.userId);
    }

    @Get('permissions')
    @UseGuards(JwtAuthGuard)
    getDataSendPermissions(@Request() request) {
        return this.usersService.getDataSendPermissions(request.userId);
    }

    @Put('permissions')
    @UseGuards(JwtAuthGuard)
    updateDataSendPermissions(@Body() dataSendPermissionsDto: DataSendPermissionsDto, @Request() request) {
        return this.usersService.updateDataSendPermissions(request.userId, dataSendPermissionsDto.hasDataSendPermissions);
    }


}
