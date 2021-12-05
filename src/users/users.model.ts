import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column({ type: 'varchar', nullable: true })
    aboutMe?: string;

    @Column({ type: Boolean, nullable: false, default: false })
    isOnline: boolean;

    @Column({ type: Boolean, nullable: false, default: false })
    isSmiling: boolean;

    @Column({ type: 'bytea', nullable: true })
    avatar?: ArrayBuffer;

    @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    wasOnline: string;

    @Column({ type: String, nullable: true, length: 120 })
    @Exclude()
    currentHashedRefreshToken?: string;
}