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
  token: string;
  @Column()
  password: string;
  @Column({ type: 'timestamp without time zone' })
  last_connexion: Date;
  @Column({ nullable: true })
  firstname: string;
  @Column({ nullable: true })
  lastname: string;
}
