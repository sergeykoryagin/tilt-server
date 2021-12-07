import { MessageDto } from 'src/messages/dto/message-dto';

export interface ChatItem {
    userId: string;
    messages: MessageDto[];
}