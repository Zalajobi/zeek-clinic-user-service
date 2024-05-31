import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';

import { Patients } from '@typeorm/entity/patient';
import { Site } from '@typeorm/entity/site';
import { z } from 'zod';
import { employerSchema } from '@lib/schemas/patientSchemas';

@Entity({
  name: 'patientEmployer',
})
export class PatientEmployer {
  constructor(data: z.infer<typeof employerSchema>) {
    this.siteId = data?.siteId as string;
    this.occupation = data?.occupation;
    this.department = data?.department ?? '';
    this.companyName = data?.companyName;
    this.companyPhone = data?.companyPhone ?? '';
    this.companyAddress = data?.companyAddress;
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
  companyName: string;

  @Column({
    nullable: true,
  })
  companyPhone?: string;

  @Column()
  companyAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  // // Relations
  @OneToOne(() => Patients, (patient) => patient.employer)
  patient?: Patients;

  @ManyToOne(() => Site, (site) => site.patientEmployer)
  site: Site;
}
