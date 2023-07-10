import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patients } from './patient';
import { CreateEmergencyContactsDataProps } from '../objectsTypes/emergencyContactsObjectTypes';

@Entity({
  name: 'emergency_contacts',
})
export class EmergencyContacts {
  constructor(data: CreateEmergencyContactsDataProps) {
    this.patientId = data?.patientId as string;
    this.name = data?.name as string;
    this.phone = data?.phone as string;
    this.address = data?.address as string;
    this.relationship = data?.relationship as string;
    this.gender = data?.gender as string;
    this.occupation = data?.occupation as string;
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

  @Column()
  occupation?: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Patients, (patients) => patients.emergencyContacts)
  patient: Patients;
}
