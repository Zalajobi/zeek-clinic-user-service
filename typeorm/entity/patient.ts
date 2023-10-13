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
// @ts-ignore
import { CreatePatientsDataProps } from '@typeorm/objectsTypes/patientObjectTypes';
import { PatientStatus } from '@typeorm/entity/enums';
import { PersonalInformation } from '@typeorm/entity/personaInfo';
// @ts-ignore
import { PatientEmployer } from '@typeorm/entity/patientEmployer';
// @ts-ignore
import { EmergencyContacts } from '@typeorm/entity/emergencyContacts';
import { Site } from '@typeorm/entity/site';
import { Provider } from '@typeorm/entity/providers';
// @ts-ignore
import { Departments } from '@typeorm/entity/departments';
// @ts-ignore
import { Units } from '@typeorm/entity/units';
// @ts-ignore
import { Servicearea } from '@typeorm/entity/servicearea';

@Entity()
export class Patients {
  constructor(data: CreatePatientsDataProps) {
    this.siteId = data?.siteId;
    this.departmentId = data?.departmentId;
    this.serviceareaId = data?.serviceareaId;
    this.unitId = data?.unitId;
    this.email = data?.email;
    this.password = data?.password;
    this.status = data?.status;
    this.careGiverId = data?.careGiverId;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  siteId: string;

  @Column({
    nullable: true,
  })
  personalInfoId: string;

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
  @OneToOne(() => PersonalInformation, (personalInfo) => personalInfo.patient, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  personalInfo: PersonalInformation;

  @OneToOne(() => PatientEmployer, (employer) => employer.patient)
  @JoinColumn()
  employer?: PatientEmployer;

  @OneToMany(() => EmergencyContacts, (emergency) => emergency.patient)
  emergencyContacts: EmergencyContacts[];

  @ManyToOne((type) => Site, (site) => site.patients)
  site: Site;

  @ManyToOne((type) => Provider, (provider) => provider.patients)
  careGiver: Provider;

  @ManyToOne((type) => Departments, (department) => department.patients)
  department: Departments;

  @ManyToOne((type) => Units, (unit) => unit.patients)
  unit: Units;

  @ManyToOne((type) => Servicearea, (unit) => unit.patients)
  servicearea: Servicearea;

  /// Add, complains, medications, allergies, diagnosis and visit
}
