import { Controller, Get } from '@nestjs/common';

@Controller('statistics')
export class StatisticsController {
    @Get()
    async getStatistics() {
        return 'statitics';
    }
}
