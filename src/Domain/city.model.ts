import { Geometry } from 'geojson';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  namefr: string;
  @Column({ type: 'double precision' })
  longitude: number;
  @Column({ type: 'double precision' })
  latitude: number;
  @Column({ type: 'int' })
  population: number;
  @Column({ type: 'int', nullable: true })
  altitude: number;
  @Column()
  timezone: string;
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
  @Column({ type: 'int' })
  paysId: number;
  @Column({ type: 'geometry' })
  geom: Geometry;
}
