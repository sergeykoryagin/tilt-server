import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/messages/messages.model';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
    constructor(@InjectRepository(Message) private messageRepository: Repository<Message>) {}

    async getTodayStatistics(userId: string) {
        const query = `select "isSmiling", count(*) from messages
        where "userId" = '${userId}'
        and date("createdAt") = CURRENT_DATE
        group by "isSmiling"`;
        const res = await this.messageRepository.query(query);
        console.log(res);
        return res;
    }

    async getMonthStatistics(userId: string) {
    }

    async getWeekdayWithMostSmilingStatistics(userId: string) {

    }

    async getSmileFrequency(userId: string) {

    }

    async getUserISentTheMostMessages(userId: string) {

    }

    async getUserWhoSentTheMostMessages(userId: string) {

    }

}