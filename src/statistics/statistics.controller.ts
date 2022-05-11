import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
    constructor(private statisticsService: StatisticsService) {}

    @Get('today')
    @UseGuards(JwtAuthGuard)
    async getTodayStatistics(@Request() request) {
        return this.statisticsService.getTodayStatistics(request.userId);
    }

    @Get('month')
    @UseGuards(JwtAuthGuard)
    async getMonthStatistics(@Request() request) {
        return `month statistics for ${request.userId}`;
    }

    @Get('weekday')
    @UseGuards(JwtAuthGuard)
    async getWeekdayWithMostSmilingStatistics(@Request() request) {
        return `the weekday with the most smiling messages for ${request.userId}`;
    }

    @Get('smile-frequency')
    @UseGuards(JwtAuthGuard)
    async getSmileFrequencyStatistics(@Request() request) {
        return `the smile frequency for ${request.userId}`;
    }

    @Get('user-i-sent')
    @UseGuards(JwtAuthGuard)
    async getUserISentTheMostMessages(@Request() request) {
        return `the user i sent the most messages for ${request.userId}`;
    }

    @Get('user-who-sent')
    @UseGuards(JwtAuthGuard)
    async getUserWhoSentTheMostMessages(@Request() request) {
        return `the user who sent to me the most messages for ${request.userId}`;
    }
}
