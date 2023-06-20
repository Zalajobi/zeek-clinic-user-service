import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patients } from './patient';

@Entity({
  name: 'emergency_contacts',
})
export class EmergencyContacts {
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
