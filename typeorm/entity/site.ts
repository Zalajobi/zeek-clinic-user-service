import {
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Provider } from '@typeorm/entity/providers';
import { Patients } from '@typeorm/entity/patient';
import { PatientEmployer } from '@typeorm/entity/patientEmployer';
import { Servicearea } from '@typeorm/entity/servicearea';
import { Units } from '@typeorm/entity/units';
import { Departments } from '@typeorm/entity/departments';
import { Roles } from '@typeorm/entity/roles';
import { BankAccount } from '@typeorm/entity/bankAccount';
import { Hospital } from '@typeorm/entity/hospital';
import { Admin } from '@typeorm/entity/admin';
import { SiteStatus } from '@typeorm/entity/enums';
import { createSiteRequestSchema } from '../../schemas/siteSchemas';
import { z } from 'zod';
import { EmergencyContacts } from '@typeorm/entity/emergencyContacts';

@Entity()
export class Site {
  constructor(data: z.infer<typeof createSiteRequestSchema>) {
    this.address = data?.address;
    this.name = data?.name;
    this.email = data?.email;
    this.city = data?.city;
    this.state = data?.state;
    this.country = data?.country;
    this.logo = data?.logo;
    this.phone = data?.phone;
    this.countryCode = data?.countryCode;
    this.zipCode = data?.zipCode;
    this.is_private = data?.is_private;
    this.has_appointment = data?.has_appointment;
    this.has_caregiver = data?.has_caregiver;
    this.has_clinical = data?.has_clinical;
    this.has_doctor = data?.has_doctor;
    this.has_emergency = data?.has_emergency;
    this.has_laboratory = data?.has_laboratory;
    this.has_medical_supply = data?.has_medical_supply;
    this.has_nursing = data?.has_nursing;
    this.has_inpatient = data?.has_inpatient;
    this.has_outpatient = data?.has_outpatient;
    this.has_pharmacy = data?.has_pharmacy;
    this.has_physical_therapy = data?.has_physical_therapy;
    this.has_procedure = data?.has_procedure;
    this.has_radiology = data?.has_radiology;
    this.has_unit = data?.has_unit;
    this.has_vital = data?.has_vital;
    this.has_wallet = data?.has_wallet;
    this.hospitalId = data?.hospital_id;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  hospitalId: string;

  @Column({
    nullable: false,
  })
  address: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: true,
  })
  city: string;

  @Column({
    nullable: true,
  })
  state: string;

  @Column({
    nullable: false,
  })
  country: string;

  @Column({
    nullable: false,
  })
  countryCode: string;

  @Column({
    nullable: true,
  })
  logo?: string;

  @Column({
    nullable: false,
  })
  phone: string;

  @Column({
    nullable: true,
    length: 25,
  })
  zipCode: string;

  @Column({
    type: 'enum',
    enum: SiteStatus,
    default: SiteStatus.PENDING,
  })
  status: SiteStatus;

  @Column({
    nullable: false,
    default: false,
  })
  is_private: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_appointment: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_caregiver: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_clinical: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_doctor: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_emergency: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_laboratory: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_medical_supply: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_nursing: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_inpatient: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_outpatient: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_pharmacy: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_physical_therapy: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_procedure: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_radiology: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_unit: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_vital: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  has_wallet: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @AfterUpdate()
  updateTimestamps() {
    this.updatedAt = new Date();
  }

  // Relations
  @OneToMany(() => Provider, (provider) => provider.site, {
    onDelete: 'CASCADE',
  })
  providers: Provider[];

  @OneToMany(() => Admin, (admin) => admin.site, { onDelete: 'CASCADE' })
  admins: Admin[];

  @ManyToOne(() => Hospital, (hospital) => hospital.sites)
  hospital: Hospital;

  @OneToMany(() => BankAccount, (bankAccounts) => bankAccounts.site, {
    onDelete: 'CASCADE',
  })
  bankAccounts: BankAccount[];

  @OneToMany(() => Roles, (roles) => roles.site, { onDelete: 'CASCADE' })
  roles: Roles[];

  @OneToMany(() => Departments, (roles) => roles.site, {
    onDelete: 'CASCADE',
  })
  departments: Departments[];

  @OneToMany(() => Units, (units) => units.site, { onDelete: 'CASCADE' })
  units: Units[];

  @OneToMany(() => Servicearea, (serviceareas) => serviceareas.site, {
    onDelete: 'CASCADE',
  })
  serviceareas: Servicearea[];

  @OneToMany(() => Patients, (patients) => patients.site, {
    onDelete: 'CASCADE',
  })
  patients: Patients[];

  @OneToMany(() => PatientEmployer, (employer) => employer.site, {
    onDelete: 'CASCADE',
  })
  patientEmployer: PatientEmployer[];

  @OneToMany(() => EmergencyContacts, (contacts) => contacts.site, {
    onDelete: 'CASCADE',
  })
  emergencyContacts: EmergencyContacts[];
}
