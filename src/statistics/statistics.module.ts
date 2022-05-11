import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Message } from 'src/messages/messages.model';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';


@Module({
    controllers: [StatisticsController],
    providers: [StatisticsService],
    imports: [TypeOrmModule.forFeature([Message]), AuthModule],
})
export class StatisticsModule {}
