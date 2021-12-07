import { Message } from 'src/messages/messages.model';
import { User } from 'src/users/users.model';
import { Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'chats',
})
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany(() => User, (user: User) => user.chats)
    @JoinTable()
    members: User[];

    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[];
}