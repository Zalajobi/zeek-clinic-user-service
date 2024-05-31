import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
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
    this.cardNumber = data?.cardNumber;
    this.siteId = data?.siteId;
    this.departmentId = data?.departmentId;
    this.serviceAreaId = data?.serviceAreaId;
    this.unitId = data?.unitId;
    this.email = data?.email;
    this.password = data?.password ?? '';
    this.status = data?.status as PatientStatus;
    this.providerId = data?.providerId;

    // Personal Info
    this.title = data?.title;
    this.firstName = data?.firstName;
    this.lastName = data?.lastName;
    this.middleName = data?.middleName ?? '';
    this.phone = data?.phone;
    this.gender = data?.gender;
    this.dob = new Date(data?.dob);
    this.address = data?.address;
    this.alternateAddress = data?.alternateAddress ?? '';
    this.city = data?.city;
    this.state = data?.state ?? '';
    this.country = data?.country;
    this.countryCode = data?.countryCode;
    this.zipCode = data?.zipCode;
    this.profilePic = data?.profilePic ?? '';
    this.religion = data?.religion ?? '';
    this.maritalStatus = data?.maritalStatus as MartialStatus;
  }

  @PrimaryGeneratedColumn('uuid')
  @Index({
    unique: true,
  })
  id: string;

  @Column({
    unique: false,
    nullable: false,
    length: 25,
  })
  @Index({
    unique: false,
  })
  cardNumber: string;

  @Column({
    nullable: false,
  })
  @Index({
    unique: false,
  })
  siteId: string;

  @Column({
    nullable: true,
  })
  employerId: string;

  @Column({
    nullable: false,
  })
  @Index({
    unique: false,
  })
  departmentId: string;

  @Column({
    nullable: false,
  })
  @Index({
    unique: false,
  })
  serviceAreaId: string;

  @Column({
    nullable: false,
  })
  @Index({
    unique: false,
  })
  unitId: string;

  @Column({
    nullable: false,
  })
  @Index({
    unique: false,
  })
  providerId: string;

  @Column({
    nullable: false,
    unique: true,
    length: 100,
  })
  @Index({
    unique: true,
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
  @Index({
    unique: false,
  })
  phone: string;

  @Column({
    nullable: false,
    length: 25,
  })
  title: string;

  @Column({
    nullable: false,
    length: 50,
  })
  firstName: string;

  @Column({
    nullable: false,
    length: 50,
  })
  lastName: string;

  @Column({
    nullable: true,
    length: 50,
  })
  middleName: string;

  @Column({
    nullable: false,
    length: 25,
  })
  gender: string;

  @Column({
    nullable: false,
  })
  dob: Date;

  @Column({
    nullable: false,
    length: 250,
  })
  address: string;

  @Column({
    nullable: true,
    length: 250,
  })
  alternateAddress: string;

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
    length: 50,
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
    length: 25,
  })
  zipCode: string;

  @Column({
    nullable: true,
    length: 500,
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
  employer: PatientEmployer;

  @OneToMany(() => EmergencyContacts, (emergency) => emergency.patient, {
    onDelete: 'CASCADE',
    nullable: true,
  })
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
