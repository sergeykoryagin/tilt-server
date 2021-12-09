import { Chat } from '../chats/chats.model';
import { User } from '../users/users.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'messages',
})
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Chat, (chat) => chat.messages)
    chat: string;

    @ManyToOne(() => User, (user) => user.messages)
    user: User;

    @Column({ type: 'varchar', nullable: false })
    text: string;

    @Column({ type: 'boolean', nullable: false, default: false })
    isSmiling: boolean;

    @Column({ type: 'boolean', nullable: false, default: false })
    isRead: boolean;

    @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: string;
}