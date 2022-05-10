import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/messages.model';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
    controllers: [StatisticsController],
    providers: [StatisticsService],
    imports: [TypeOrmModule.forFeature([Message])],
})
export class StatisticsModule {}
