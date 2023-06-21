import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patients } from './patient';
import { Diagnosis } from './diagnosis';
import { Site } from './site';

@Entity()
export class Visits {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  patientId: string;

  @Column({
    nullable: false,
  })
  siteId: string;

  @CreateDateColumn()
  visit_time: Date;

  @CreateDateColumn()
  left_at: Date;

  // Relations
  @OneToMany(() => Diagnosis, (diagnosis) => diagnosis.visit)
  diagnosis: Diagnosis[];

  @ManyToOne((type) => Patients, (patients) => patients.visits)
  patient: Patients;

  @ManyToOne((type) => Site, (site) => site.visits)
  site: Site;
}
