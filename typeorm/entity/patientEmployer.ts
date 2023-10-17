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

@Entity()
export class PatientEmployer {
  constructor(data: CreatePatientEmployerProps) {
    this.siteId = data?.siteId;
    this.occupation = data?.occupation as string;
    this.department = data?.department as string;
    this.company_name = data?.company_name;
    this.company_phone = data?.company_phone;
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

  @Column()
  company_phone: string;

  @Column()
  company_address: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => Patients, (patient) => patient.employer)
  @JoinColumn()
  patient?: Patients;

  @ManyToOne((type) => Site, (site) => site.patientEmployer)
  site: Site;
}
