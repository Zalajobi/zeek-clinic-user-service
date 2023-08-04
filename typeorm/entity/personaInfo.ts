import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Provider } from './providers';
import { Admin } from './admin';
import { ProfileInfoModelProps } from '../../types';
import { MartialStatus } from './enums';
import { Patients } from './patient';

@Entity({
  name: 'personal_info',
})
export class PersonalInformation {
  constructor(data: ProfileInfoModelProps) {
    this.providerId = data?.providerId as string;
    this.patientId = data?.patientId as string;
    this.adminId = data?.adminId as string;
    this.phone = data?.phone as string;
    this.first_name = data?.first_name as string;
    this.last_name = data?.last_name as string;
    this.middle_name = data?.middle_name as string;
    this.title = data?.title as string;
    this.gender = data?.gender as string;
    this.dob = new Date(data?.dob as string);
    this.address = data?.address as string;
    this.city = data?.city as string;
    this.state = data?.state as string;
    this.country = data?.country as string;
    this.zip_code = data?.zip_code as string;
    this.profile_pic = data?.profile_pic as string;
    this.religion = data?.religion as string;
    this.marital_status = data?.marital_status as MartialStatus;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
    unique: true,
  })
  providerId?: string;

  @Column({
    nullable: true,
    unique: true,
  })
  patientId?: string;

  @Column({
    nullable: true,
    unique: true,
  })
  adminId?: string;

  @Column({
    unique: true,
  })
  phone: string;

  @Column({
    nullable: false,
  })
  first_name: string;

  @Column({
    nullable: false,
  })
  last_name: string;

  @Column({
    nullable: true,
  })
  middle_name: string;

  @Column()
  title: string;

  @Column()
  gender: string;

  @Column()
  dob: Date;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column({
    default: 'unspecified',
  })
  religion: string;

  @Column({
    type: 'enum',
    enum: MartialStatus,
    default: MartialStatus.OTHERS,
    nullable: false,
  })
  marital_status: MartialStatus;

  @Column({
    nullable: true,
  })
  zip_code: string;

  @Column({
    nullable: true,
  })
  profile_pic: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => Provider, (provider) => provider.personalInfo)
  @JoinColumn()
  provider?: Provider;

  @OneToOne(() => Patients)
  @JoinColumn()
  patient?: Patients;

  @OneToOne(() => Admin)
  @JoinColumn()
  admin?: Admin;
}
