import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.model';

@Entity({ name: 'aleas' })
export class Alea {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToOne((type) => Category, (category) => category.id)
  @JoinColumn({ name: 'category' })
  category: Category;
}
