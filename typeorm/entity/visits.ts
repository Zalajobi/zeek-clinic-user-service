import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Visits {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
