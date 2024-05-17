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
import { ProviderStatus } from '@typeorm/entity/enums';
import { PersonalInformation } from '@typeorm/entity/personalInfo';
import { Patients } from '@typeorm/entity/patient';
import { Site } from '@typeorm/entity/site';
import { Roles } from '@typeorm/entity/roles';
import { Departments } from '@typeorm/entity/departments';
import { Units } from '@typeorm/entity/units';
import { Servicearea } from '@typeorm/entity/servicearea';
import { createProviderRequestSchema } from '@lib/schemas/providerSchemas';
import { z } from 'zod';

@Entity()
export class Provider {
  constructor(data: z.infer<typeof createProviderRequestSchema>) {
    this.siteId = data?.siteId;
    this.primaryRoleId = data?.role;
    this.departmentId = data?.department;
    this.serviceareaId = data?.serviceArea;
    this.unitId = data?.unit;
    this.email = data?.email;
    this.password = data?.password;
    this.username = data?.username ?? '';
    this.staff_id = data?.staff_id;
    this.is_consultant = data?.is_consultant;
    this.is_specialist = data?.is_specialist;
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
    nullable: true,
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
  @OneToOne(
    () => PersonalInformation,
    (personalInfo) => personalInfo.provider,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn()
  personalInfo: PersonalInformation;

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
