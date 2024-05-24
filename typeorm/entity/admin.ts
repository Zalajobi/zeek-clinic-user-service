import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Site } from '@typeorm/entity/site';
import { AdminRoles, MartialStatus } from '@typeorm/entity/enums';
import { createAdminRequestSchema } from '@lib/schemas/adminSchemas';
import { z } from 'zod';

@Entity()
export class Admin {
  constructor(data: z.infer<typeof createAdminRequestSchema>) {
    this.siteId = data?.siteId as string;
    this.role = data?.role as AdminRoles;
    this.email = data?.email as string;
    this.password = data?.password as string;
    this.staffId = data?.staffId;

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
    nullable: false,
  })
  @Index({
    unique: false,
  })
  siteId: string;

  @Column({
    type: 'enum',
    enum: AdminRoles,
    unique: false,
    nullable: false,
  })
  role: AdminRoles;

  @Column({
    unique: true,
    nullable: false,
  })
  @Index({
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: false,
  })
  @Index({
    unique: false,
  })
  staffId: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Site, (site) => site.admins)
  site: Site;
}
