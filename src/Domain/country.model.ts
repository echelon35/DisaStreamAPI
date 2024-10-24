import { Geometry } from 'geojson';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  namefr: string;
  @Column({ nullable: true })
  trigramme: string;
  @Column({ nullable: true })
  iso3166_2: string;
  @Column()
  continent: string;
  @Column({ type: 'int', default: 0, nullable: true })
  population: number;
  @Column({ type: 'int', nullable: true })
  superficie: number;
  @Column({ type: 'geometry' })
  geom: Geometry;
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
  @Column({ nullable: true })
  wikilink: string;
  @Column({ nullable: true })
  placeId: string;
}
