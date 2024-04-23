import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { HospitalStatus } from '@typeorm/entity/enums';

import { Site } from '@typeorm/entity/site';
import { createHospitalRequestSchema } from '@lib/schemas/hospitalSchemas';
import { z } from 'zod';

@Entity()
export class Hospital {
  constructor(data: z.infer<typeof createHospitalRequestSchema>) {
    this.name = data?.name;
    this.email = data?.email;
    this.phone = data?.phone;
    this.address = data?.address;
    this.city = data?.city;
    this.state = data?.state;
    this.country = data?.country;
    this.logo = data?.logo;
    this.zip_code = data?.zip_code?.toString();
    this.country_code = data?.country_code;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    default: 0,
    nullable: false,
  })
  site_count: number;

  @Column({
    nullable: false,
  })
  phone: string;

  @Column({
    nullable: false,
  })
  address: string;

  @Column({
    nullable: true,
  })
  city?: string;

  @Column({
    nullable: true,
  })
  state?: string;

  @Column({
    nullable: false,
  })
  country: string;

  @Column({
    nullable: true,
  })
  logo?: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: HospitalStatus,
    default: HospitalStatus.PENDING,
  })
  status: string;

  @Column({
    nullable: true,
  })
  zip_code?: string;

  @Column({
    nullable: true,
  })
  country_code?: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany((type) => Site, (site) => site.hospital, { onDelete: 'CASCADE' })
  // @JoinColumn()
  sites: Site[];
}
