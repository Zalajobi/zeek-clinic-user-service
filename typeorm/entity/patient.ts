import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { PatientStatus } from './enums';
import { truncate } from 'fs';
import { Site } from './site';

@Entity()
export class Patients {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  siteId: string;

  @Column({
    nullable: false,
  })
  personalInfoId?: string;

  @Column({
    nullable: false,
  })
  departmentId: string;

  @Column({
    nullable: false,
  })
  serviceareaId: string;

  @Column({
    nullable: false,
  })
  unitId: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    unique: true,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: PatientStatus,
    default: PatientStatus.PENDING,
    nullable: false,
  })
  status: PatientStatus;

  @Column({
    nullable: true,
  })
  occupation?: string;

  @Column({
    nullable: true,
  })
  department?: string;

  // Relations
  @ManyToOne((type) => Site, (site) => site.patients)
  site: Site;

  /// Add, complains, medications, allergies, diagnosis and visit
}
