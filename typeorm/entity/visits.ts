import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patients } from './patient';

@Entity()
export class Visits {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  patientId: string;

  @CreateDateColumn()
  visit_time: Date;

  @CreateDateColumn()
  left_at: Date;

  // Relations
  @ManyToOne((type) => Patients, (patients) => patients.visits)
  patient: Patients;
}
