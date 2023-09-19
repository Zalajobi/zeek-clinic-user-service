import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patients } from './patient';
import { CreateEmergencyContactsDataProps } from '@typeorm/objectsTypes/emergencyContactsObjectTypes';

@Entity({
  name: 'emergency_contacts',
})
export class EmergencyContacts {
  constructor(data: CreateEmergencyContactsDataProps) {
    this.patientId = data?.patientId;
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
