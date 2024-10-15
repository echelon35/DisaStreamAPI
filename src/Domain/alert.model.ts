import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.model';
import { Alea } from './alea.model';
import { ReportType } from './reportType.model';
import { Geometry } from 'geojson';

@Index(['name', 'userId'], { unique: true })
@Entity({ name: 'alerts' })
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @Column()
  userId: number;
  @Column()
  name: string;
  @Column({ type: 'geometry', nullable: true })
  areas: Geometry;
  @ManyToMany(() => Alea)
  @JoinTable({ name: 'alerts_aleas' })
  aleas: Alea[];
  @Column({ type: 'json', nullable: true })
  criterias: JSON;
  @OneToMany(() => ReportType, (reportType) => reportType.id)
  @JoinColumn({ name: 'reportTypes' })
  reportTypes: ReportType;
  @CreateDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
  @UpdateDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
