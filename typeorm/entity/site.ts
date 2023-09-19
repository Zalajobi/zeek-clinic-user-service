import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hospital } from '@typeorm/entity/hospital';
import { BankAccount } from '@typeorm/entity/bankAccount';
import { SiteStatus } from '@typeorm/entity/enums';
import { Roles } from '@typeorm/entity/roles';
import { Provider } from '@typeorm/entity/providers';
import { Departments } from '@typeorm/entity/departments';
import { Admin } from '@typeorm/entity/admin';
import { Units } from '@typeorm/entity/units';
import { Servicearea } from '@typeorm/entity/servicearea';
import { Patients } from '@typeorm/entity/patient';
import { PatientEmployer } from '@typeorm/entity/patientEmployer';
import { siteModelProps } from '@typeorm/objectsTypes/siteObjectTypes';

@Entity()
export class Site {
  constructor(data: siteModelProps) {
    this.address = data?.address;
    this.name = data?.name;
    this.email = data?.email;
    this.city = data?.city;
    this.state = data?.state;
    this.country = data?.country;
    this.logo = data?.logo as string;
    this.time_zone = data?.time_zone as string;
    this.phone = data?.phone;
    this.zip_code = data?.zip_code as string;
    this.is_private = data?.is_private as boolean;
    this.has_appointment = data?.has_appointment as boolean;
    this.has_caregiver = data?.has_caregiver as boolean;
    this.has_clinical = data?.has_clinical as boolean;
    this.has_doctor = data?.has_doctor as boolean;
    this.has_emergency = data?.has_emergency as boolean;
    this.has_laboratory = data?.has_laboratory as boolean;
    this.has_medical_supply = data?.has_medical_supply as boolean;
    this.has_nursing = data?.has_nursing as boolean;
    this.has_inpatient = data?.has_inpatient as boolean;
    this.has_outpatient = data?.has_outpatient as boolean;
    this.has_pharmacy = data?.has_pharmacy as boolean;
    this.has_physical_therapy = data?.has_physical_therapy as boolean;
    this.has_procedure = data?.has_procedure as boolean;
    this.has_radiology = data?.has_radiology as boolean;
    this.has_unit = data?.has_unit as boolean;
    this.has_vital = data?.has_vital as boolean;
    this.has_wallet = data?.has_wallet as boolean;
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
    nullable: false,
  })
  city: string;

  @Column({
    nullable: false,
  })
  state: string;

  @Column({
    nullable: false,
  })
  country: string;

  @Column({
    nullable: true,
  })
  logo?: string;

  @Column({
    nullable: true,
  })
  time_zone?: string;

  @Column({
    nullable: false,
  })
  phone: string;

  @Column({
    nullable: false,
  })
  zip_code: string;

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
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany((type) => Admin, (admin) => admin.site, { onDelete: 'CASCADE' })
  admins: Admin[];

  @ManyToOne((type) => Hospital, (hospital) => hospital.sites)
  hospital: Hospital;

  @OneToMany((type) => BankAccount, (bankAccounts) => bankAccounts.site, {
    onDelete: 'CASCADE',
  })
  bankAccounts: BankAccount[];

  @OneToMany((type) => Roles, (roles) => roles.site, { onDelete: 'CASCADE' })
  roles: Roles[];

  @OneToMany((type) => Departments, (roles) => roles.site, {
    onDelete: 'CASCADE',
  })
  departments: Departments[];

  @OneToMany((type) => Units, (units) => units.site, { onDelete: 'CASCADE' })
  units: Units[];

  @OneToMany((type) => Servicearea, (serviceareas) => serviceareas.site, {
    onDelete: 'CASCADE',
  })
  serviceareas: Servicearea[];

  @OneToMany((type) => Provider, (provider) => provider.site, {
    onDelete: 'CASCADE',
  })
  providers: Provider[];

  @OneToMany((type) => Patients, (patients) => patients.site, {
    onDelete: 'CASCADE',
  })
  patients: Patients[];

  @OneToMany((type) => PatientEmployer, (employer) => employer.site, {
    onDelete: 'CASCADE',
  })
  patientEmployer: PatientEmployer[];
}
