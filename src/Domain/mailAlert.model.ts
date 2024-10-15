import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';

@Entity('mailAlerts')
export class MailAlert {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  mail: string;
  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @Column()
  userId: number;
  @Column({ default: false })
  isVerified: boolean;
}
