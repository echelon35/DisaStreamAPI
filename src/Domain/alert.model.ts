import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.model';
import { Alea } from './alea.model';
import { ReportType } from './reportType.model';
import { Geometry } from 'geojson';

@Entity({ name: 'alerts' })
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user' })
  user: User;
  @Column({ type: 'geometry', nullable: true })
  areas: Geometry;
  @OneToMany(() => Alea, (alea) => alea.id)
  @JoinColumn({ name: 'aleas' })
  aleas: string[];
  @Column({ type: 'json' })
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
