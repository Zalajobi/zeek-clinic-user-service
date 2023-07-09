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

@Entity()
export class Patients {
  constructor(data: CreatePatientsDataProps) {
    this.siteId = data?.siteId as string;
    this.personalInfoId = data?.personalInfoId as string;
    this.departmentId = data?.departmentId as string;
    this.serviceareaId = data?.serviceareaId as string;
    this.unitId = data?.unitId as string;
    this.email = data?.email as string;
    this.password = data?.password as string;
    this.status = data?.status as PatientStatus;
    this.occupation = data?.occupation as string;
    this.department = data?.department as string;
    this.employer = data?.employer as string;
    this.employer_name = data?.employer_name as string;
    this.employer_phone = data?.employer_phone as string;
    this.careGiverId = data?.careGiverId as string;
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
  personalInfoId: string;

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

  @Column({
    nullable: true,
  })
  occupation?: string;

  @Column({
    nullable: true,
  })
  department?: string;

  @Column()
  employer: string;

  @Column()
  employer_name: string;

  @Column()
  employer_phone: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => PersonalInformation, (personalInfo) => personalInfo.patient)
  @JoinColumn()
  personalInfo?: PersonalInformation;

  @OneToMany(() => EmergencyContacts, (emergency) => emergency.patient)
  emergencyContacts: EmergencyContacts[];

  @ManyToOne((type) => Site, (site) => site.patients)
  site: Site;

  @ManyToOne((type) => Provider, (provider) => provider.patients)
  careGiver: Provider;

  /// Add, complains, medications, allergies, diagnosis and visit
}
