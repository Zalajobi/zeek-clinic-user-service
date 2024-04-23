import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { CreatePatientEmployerProps } from '@typeorm/objectsTypes/patientEmployerObjectType';
import { Patients } from '@typeorm/entity/patient';
import { Site } from '@typeorm/entity/site';
import { z } from 'zod';
import { employerSchema } from '@lib/schemas/patientSchemas';

@Entity()
export class PatientEmployer {
  constructor(data: z.infer<typeof employerSchema>) {
    this.siteId = data?.siteId as string;
    this.occupation = data?.occupation;
    this.department = data?.department ?? '';
    this.company_name = data?.company_name;
    this.company_phone = data?.company_phone ?? '';
    this.company_address = data?.company_address;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  siteId: string;

  @Column({
    nullable: false,
  })
  occupation: string;

  @Column({
    nullable: true,
  })
  department: string;

  @Column()
  company_name: string;

  @Column({
    nullable: true,
  })
  company_phone?: string;

  @Column()
  company_address: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => Patients, (patient) => patient.employer, {
    onDelete: 'CASCADE',
  })
  patient?: Patients;

  @ManyToOne((type) => Site, (site) => site.patientEmployer)
  site: Site;
}
