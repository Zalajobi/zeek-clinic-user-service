import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// @ts-ignore
import { Provider } from '@typeorm/entity/providers';
// @ts-ignore
import { Admin } from '@typeorm/entity/admin';
import { ProfileInfoModelProps } from '../../types';
import { MartialStatus } from '@typeorm/entity/enums';
// @ts-ignore
import { Patients } from '@typeorm/entity/patient';

@Entity({
  name: 'personal_info',
})
export class PersonalInformation {
  constructor(data: ProfileInfoModelProps) {
    this.patientId = data?.patientId as string;
    this.phone = data?.phone as string;
    this.first_name = data?.first_name;
    this.last_name = data?.last_name;
    this.middle_name = data?.middle_name;
    this.title = data?.title;
    this.gender = data?.gender;
    this.dob = new Date(data?.dob);
    this.address = data?.address;
    this.address_two = data?.address_two as string;
    this.city = data?.city;
    this.state = data?.state;
    this.country = data?.country;
    this.zip_code = data?.zip_code;
    this.profile_pic = data?.profile_pic as string;
    this.religion = data?.religion as string;
    this.marital_status = data?.marital_status as MartialStatus;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({
  //   nullable: true,
  //   unique: true,
  // })
  // providerId?: string;

  @Column({
    nullable: true,
    unique: true,
  })
  patientId?: string;

  // @Column({
  //   nullable: true,
  //   unique: true,
  // })
  // adminId?: string;

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

  @Column({
    default: '',
  })
  address_two?: string;

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
  provider?: Provider;

  @OneToOne(() => Patients)
  @JoinColumn()
  patient?: Patients;

  @OneToOne(() => Admin, (admin) => admin.personalInfo)
  admin: Admin;
}
