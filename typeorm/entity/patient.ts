import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { PatientStatus } from './enums';
import { Site } from './site';
import { PersonalInformation } from './personaInfo';
import { EmergencyContacts } from './emergencyContacts';
import { CreatePatientsDataProps } from '../objectsTypes/patientObjectTypes';
import { Provider } from './providers';
import { PatientEmployer } from './patientEmployer';

@Entity()
export class Patients {
  constructor(data: CreatePatientsDataProps) {
    this.siteId = data?.siteId as string;
    // this.personalInfoId = data?.personalInfoId as string;
    this.departmentId = data?.departmentId as string;
    this.serviceareaId = data?.serviceareaId as string;
    this.unitId = data?.unitId as string;
    this.email = data?.email as string;
    this.password = data?.password as string;
    this.status = data?.status as PatientStatus;
    this.careGiverId = data?.careGiverId as string;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  siteId: string;

  // @Column({
  //   nullable: true,
  // })
  // personalInfoId: string;

  @Column({
    nullable: true,
  })
  employerId: string;

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
    nullable: true,
  })
  careGiverId: string;

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

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => PersonalInformation, (personalInfo) => personalInfo.patient)
  @JoinColumn()
  personalInfo?: PersonalInformation;

  @OneToOne(() => PatientEmployer, (employer) => employer.patient)
  @JoinColumn()
  employer?: PatientEmployer;

  @OneToMany(() => EmergencyContacts, (emergency) => emergency.patient)
  emergencyContacts: EmergencyContacts[];

  @ManyToOne((type) => Site, (site) => site.patients)
  site: Site;

  @ManyToOne((type) => Provider, (provider) => provider.patients)
  careGiver: Provider;

  /// Add, complains, medications, allergies, diagnosis and visit
}
