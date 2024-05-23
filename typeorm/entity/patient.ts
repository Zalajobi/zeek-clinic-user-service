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
import { MartialStatus, PatientStatus } from '@typeorm/entity/enums';
import { PatientEmployer } from '@typeorm/entity/patientEmployer';
import { EmergencyContacts } from '@typeorm/entity/emergencyContacts';
import { Site } from '@typeorm/entity/site';
import { Provider } from '@typeorm/entity/providers';
import { Departments } from '@typeorm/entity/departments';
import { Units } from '@typeorm/entity/units';
import { Servicearea } from '@typeorm/entity/servicearea';
import { z } from 'zod';
import { createPatientRequestSchema } from '@lib/schemas/patientSchemas';

@Entity({
  name: 'patient',
})
export class Patients {
  constructor(data: z.infer<typeof createPatientRequestSchema>) {
    this.siteId = data?.siteId;
    this.departmentId = data?.departmentId;
    this.serviceAreaId = data?.serviceareaId;
    this.unitId = data?.unitId;
    this.email = data?.email;
    this.password = data?.password ?? '';
    this.status = data?.status as PatientStatus;
    this.providerId = data?.careGiverId;
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
  employerId: string;

  @Column({
    nullable: false,
  })
  departmentId: string;

  @Column({
    nullable: false,
  })
  serviceAreaId: string;

  @Column({
    nullable: false,
  })
  unitId: string;

  @Column({
    nullable: false,
  })
  providerId: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    unique: false,
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
    nullable: false,
    length: 25,
  })
  phone: string;

  @Column({
    nullable: false,
    length: 10,
  })
  title: string;

  @Column({
    nullable: false,
    length: 25,
  })
  firstName: string;

  @Column({
    nullable: false,
    length: 25,
  })
  lastName: string;

  @Column({
    nullable: true,
    length: 25,
  })
  middleName: string;

  @Column({
    nullable: false,
    length: 10,
  })
  gender: string;

  @Column({
    nullable: true,
  })
  dob: Date;

  @Column({
    nullable: false,
    length: 150,
  })
  address: string;

  @Column({
    nullable: false,
    length: 50,
  })
  city: string;

  @Column({
    nullable: true,
    length: 50,
  })
  state: string;

  @Column({
    nullable: false,
    length: 25,
  })
  country: string;

  @Column({
    nullable: false,
    length: 5,
  })
  countryCode: string;

  @Column({
    nullable: true,
    length: 50,
  })
  religion: string;

  @Column({
    type: 'enum',
    enum: MartialStatus,
    default: MartialStatus.OTHERS,
    nullable: false,
  })
  maritalStatus: MartialStatus;

  @Column({
    nullable: false,
    length: 10,
  })
  zipCode: string;

  @Column({
    nullable: true,
    length: 150,
  })
  profilePic: string;

  @CreateDateColumn()
  createdAt: Date;

  // @Column('timestamp', {
  //   default: () => 'CURRENT_TIMESTAMP',
  //   onUpdate: 'CURRENT_TIMESTAMP',
  // })
  @CreateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne(() => PatientEmployer, (employer) => employer.patient, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  employer?: PatientEmployer;

  @OneToMany(() => EmergencyContacts, (emergency) => emergency.patient)
  emergencyContacts: EmergencyContacts[];

  @ManyToOne(() => Site, (site) => site.patients)
  site: Site;

  @ManyToOne(() => Provider, (provider) => provider.patients)
  provider: Provider;

  @ManyToOne(() => Departments, (department) => department.patients)
  department: Departments;

  @ManyToOne(() => Units, (unit) => unit.patients)
  unit: Units;

  @ManyToOne(() => Servicearea, (unit) => unit.patients)
  serviceArea: Servicearea;

  /// Add, complains, medications, allergies, diagnosis and visit
}
