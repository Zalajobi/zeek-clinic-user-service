import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
// @ts-ignore
import { hospitalModelProps } from '../../types';
import { HospitalStatus } from '@typeorm/entity/enums';
import { Site } from '@typeorm/entity/site';

@Entity()
export class Hospital {
  constructor(data: hospitalModelProps) {
    this.name = data?.name as string;
    this.email = data?.email as string;
    this.phone = data?.phone as string;
    this.address = data?.address as string;
    this.city = data?.city as string;
    this.state = data?.state as string;
    this.country = data?.country as string;
    this.logo = data?.logo as string;
    this.zip_code = data?.zip_code as string;
    this.country_code = data?.country_code as string;
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
