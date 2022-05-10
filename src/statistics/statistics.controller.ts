import { Controller, Get } from '@nestjs/common';

@Controller('statistics')
export class StatisticsController {
    @Get('kek')
    async getStatistics() {
        return 'statitics';
    }
}
