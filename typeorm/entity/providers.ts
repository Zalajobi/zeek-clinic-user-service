import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Site } from './site';
import { Roles } from './roles';
import { Departments } from './departments';
import { PersonalInformation } from './personaInfo';
import { Units } from './units';
import { ProviderStatus } from './enums';
import { Servicearea } from './servicearea';
import { Patients } from './patient';

@Entity()
export class Provider {
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
    nullable: true,
  })
  personalInfoId?: string;

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
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    nullable: false,
  })
  staff_id: string;

  @Column({
    default: false,
  })
  is_consultant: boolean;

  @Column({
    default: false,
    nullable: false,
  })
  is_specialist: boolean;

  @Column({
    default: true,
    nullable: false,
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
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => PersonalInformation, (personalInfo) => personalInfo.provider)
  @JoinColumn()
  personalInfo?: PersonalInformation;

  @OneToMany((type) => Patients, (patients) => patients.careGiver)
  patients: Patients[];

  @ManyToOne((type) => Site, (site) => site.roles)
  site: Site;

  @ManyToOne((type) => Roles, (roles) => roles.providers)
  primary_role: Roles;

  @ManyToOne((type) => Departments, (department) => department.providers)
  department: Departments;

  @ManyToOne((type) => Units, (unit) => unit.providers)
  unit: Units;

  @ManyToOne((type) => Servicearea, (unit) => unit.providers)
  servicearea: Servicearea;
}
