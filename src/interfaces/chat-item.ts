import { MessageDto } from '../messages/dto/message-dto';

export interface ChatItem {
    userId: string;
    messages: MessageDto[];
}
