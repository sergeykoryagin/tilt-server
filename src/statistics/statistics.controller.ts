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
        return this.statisticsService.getMonthStatistics(request.userId);
    }

    @Get('total')
    @UseGuards(JwtAuthGuard)
    async getTotalDistributionStatistics(@Request() request) {
        return this.statisticsService.getTotalDistribution(request.userId);
    }

    @Get('weekday')
    @UseGuards(JwtAuthGuard)
    async getWeekdayWithMostSmilingStatistics(@Request() request) {
        return this.statisticsService.getWeekdayWithMostSmilingStatistics(
            request.userId,
        );
    }

    @Get('user-i-sent')
    @UseGuards(JwtAuthGuard)
    async getUserISentTheMostMessages(@Request() request) {
        return this.statisticsService.getMonthStatistics(request.userId);
    }

    @Get('user-who-sent')
    @UseGuards(JwtAuthGuard)
    async getUserWhoSentTheMostMessages(@Request() request) {
        return this.statisticsService.getMonthStatistics(request.userId);
    }
}
