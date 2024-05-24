import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Patients } from '@typeorm/entity/patient';
import { Site } from '@typeorm/entity/site';
import { emergencyContactSchema } from '@lib/schemas/patientSchemas';
import { z } from 'zod';

@Entity({
  name: 'emergencyContact',
})
export class EmergencyContacts {
  constructor(data: z.infer<typeof emergencyContactSchema>) {
    this.patientId = data?.patientId ?? '';
    this.name = data?.name;
    this.phone = data?.phone;
    this.address = data?.address;
    this.relationship = data?.relationship;
    this.gender = data?.gender;
    this.occupation = data?.occupation;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  patientId: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  relationship: string;

  @Column()
  gender: string;

  @Column({
    nullable: true,
  })
  occupation?: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Patients, (patients) => patients.emergencyContacts, {
    onDelete: 'CASCADE',
  })
  patient: Patients;

  @ManyToOne(() => Site, (site) => site.emergencyContacts)
  site: Site;
}
