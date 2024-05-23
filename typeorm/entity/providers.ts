import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MartialStatus, ProviderStatus } from '@typeorm/entity/enums';
import { Patients } from '@typeorm/entity/patient';
import { Site } from '@typeorm/entity/site';
import { Roles } from '@typeorm/entity/roles';
import { Departments } from '@typeorm/entity/departments';
import { Units } from '@typeorm/entity/units';
import { Servicearea } from '@typeorm/entity/servicearea';
import { createProviderRequestSchema } from '@lib/schemas/providerSchemas';
import { z } from 'zod';

@Entity({
  name: 'provider',
})
export class Provider {
  constructor(data: z.infer<typeof createProviderRequestSchema>) {
    this.siteId = data?.siteId;
    this.primaryRoleId = data?.role;
    this.departmentId = data?.department;
    this.serviceAreaId = data?.serviceArea;
    this.unitId = data?.unit;
    this.email = data?.email;
    this.password = data?.password;
    this.staffId = data?.staff_id;
    this.isConsultant = data?.is_consultant;
    this.isSpecialist = data?.is_specialist;
    this.appointments = data?.appointments;
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
  primaryRoleId: string;

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
    unique: true,
    length: 75,
  })
  email: string;

  @Column({
    nullable: false,
    unique: false,
  })
  password: string;

  @Column({
    unique: false,
    nullable: false,
    length: 25,
  })
  staffId: string;

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
    nullable: false,
  })
  dob: Date;

  @Column({
    nullable: false,
    length: 150,
  })
  address: string;

  @Column({
    nullable: true,
    length: 150,
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

  @Column({
    default: false,
  })
  isConsultant: boolean;

  @Column({
    default: false,
  })
  isSpecialist: boolean;

  @Column({
    default: false,
  })
  appointments: boolean;

  @Column({
    type: 'enum',
    enum: ProviderStatus,
    default: ProviderStatus.PENDING,
    nullable: false,
  })
  status: ProviderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Patients, (patients) => patients.provider)
  patients: Patients[];

  @ManyToOne(() => Site, (site) => site.roles)
  site: Site;

  @ManyToOne(() => Roles, (roles) => roles.providers)
  primaryRole: Roles;

  @ManyToOne(() => Departments, (department) => department.providers)
  department: Departments;

  @ManyToOne(() => Units, (unit) => unit.providers)
  unit: Units;

  @ManyToOne(() => Servicearea, (unit) => unit.providers)
  serviceArea: Servicearea;
}
