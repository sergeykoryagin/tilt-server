import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WeekdayDistributionResult } from 'src/interfaces/weekday-distribution-result';
import { Message } from 'src/messages/messages.model';
import { Repository } from 'typeorm';
import { EmotionDistributionWithUserDto } from './dto/emotion-distribution-with-user.dto';
import { EmotionDistributionDto } from './dto/emotion-distribution.dto';
import { WeekdayDistributionDto } from './dto/weekday-distribution.dto';
import { convertToWeekdayDto } from './utils/convert-to-weekday-dto';
import { createDistributionStatisticsQuery } from './utils/create-distribution-statistics-query';
import { createUserISentMostMessagesQuery } from './utils/create-user-i-sent-most-messages-query';
import { createUserWhoSentMostMessagesQuery } from './utils/create-user-who-sent-most-messages-query';
import { createWeekdayDestributionQuery } from './utils/create-weekday-distrubution-query';

@Injectable()
export class StatisticsService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {}

    async getTodayStatistics(userId: string): Promise<EmotionDistributionDto> {
        const query = createDistributionStatisticsQuery(userId, 'day');
        return (await this.messageRepository.query(query))[0];
    }

    async getMonthStatistics(userId: string): Promise<EmotionDistributionDto> {
        const query = createDistributionStatisticsQuery(userId, 'month');
        return (await this.messageRepository.query(query))[0];
    }

    async getWeekdayWithMostSmilingStatistics(
        userId: string,
    ): Promise<WeekdayDistributionDto> {
        const query = createWeekdayDestributionQuery(userId);
        const distribution: Array<WeekdayDistributionResult> =
            await this.messageRepository.query(query);
        return convertToWeekdayDto(distribution);
    }

    async getTotalDistribution(
        userId: string,
    ): Promise<EmotionDistributionDto> {
        const query = createDistributionStatisticsQuery(userId, 'total');
        return (await this.messageRepository.query(query))[0];
    }

    async getUserISentTheMostMessages(
        userId: string,
    ): Promise<EmotionDistributionWithUserDto> {
        const query = createUserISentMostMessagesQuery(userId);
        return (await this.messageRepository.query(query))[0];
    }

    async getUserWhoSentTheMostMessages(
        userId: string,
    ): Promise<EmotionDistributionWithUserDto> {
        const query = createUserWhoSentMostMessagesQuery(userId);
        return (await this.messageRepository.query(query))[0];
    }
}
