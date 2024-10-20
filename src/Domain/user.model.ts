import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column({ unique: true })
  mail: string;
  @Column({ nullable: true })
  password: string;
  @Column({ type: 'timestamp without time zone', default: new Date() })
  last_connexion: Date;
  @Column({ nullable: true })
  firstname: string;
  @Column({ nullable: true })
  lastname: string;
  @Column()
  provider: string;
  @Column()
  providerId: string;
  @Column({ nullable: true })
  avatar: string;
}
