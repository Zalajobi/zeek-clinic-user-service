import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Visits } from './visits';
import { Site } from './site';

@Entity()
export class Diagnosis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  visitId: string;

  @Column()
  siteId: string;

  @Column()
  primary_diagnosis: string;

  @Column()
  other_diagnosis: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => Visits, (visits) => visits.diagnosis)
  visit: Visits;

  @ManyToOne((type) => Site, (site) => site.diagnosis)
  site: Site;
}
