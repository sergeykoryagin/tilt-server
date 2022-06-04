import { Chat } from '../chats/chats.model';
import { Message } from '../messages/messages.model';
import {
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
    name: 'users',
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true, nullable: false })
    login: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({ type: 'varchar', nullable: true, length: 64 })
    aboutMe?: string;

    @Column({ type: 'bytea', nullable: true })
    avatar?: ArrayBuffer;

    @Column({
        type: 'timestamp',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    wasOnline: string;

    @Column({ type: String, nullable: true, length: 120 })
    currentHashedRefreshToken?: string;

    @Column({ type: Boolean, nullable: false, default: false })
    hasDataSendPermissions: boolean;

    @ManyToMany(() => Chat, (chat: Chat) => chat.members)
    chats: Chat[];

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[];
}
