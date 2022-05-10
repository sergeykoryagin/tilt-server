import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../messages/messages.model';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
    constructor(@InjectRepository(Message) private messageRepository: Repository<Message>) {}
}
