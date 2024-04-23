import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Provider } from '@typeorm/entity/providers';
import { Admin } from '@typeorm/entity/admin';
import { MartialStatus } from '@typeorm/entity/enums';
import { Patients } from '@typeorm/entity/patient';
import { z } from 'zod';
import { profileDataRequestSchema } from '@lib/schemas/adminSchemas';

@Entity({
  name: 'personal_info',
})
export class PersonalInformation {
  constructor(data: z.infer<typeof profileDataRequestSchema>) {
    this.phone = data?.phone;
    this.first_name = data?.first_name;
    this.last_name = data?.last_name;
    this.middle_name = data?.middle_name ?? '';
    this.title = data?.title;
    this.gender = data?.gender;
    this.dob = new Date(data?.dob);
    this.address = data?.address;
    this.address_two = data?.address_two ?? '';
    this.city = data?.city;
    this.state = data?.state;
    this.country = data?.country;
    this.zip_code = data?.zip_code;
    this.profile_pic = data?.profile_pic ?? '';
    this.religion = data?.religion ?? '';
    this.marital_status = data?.marital_status as MartialStatus;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({
  //   nullable: true,
  //   unique: true,
  // })
  // providerId?: string;

  // @Column({
  //   nullable: true,
  //   unique: true,
  // })
  // patientId?: string;

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

  @Column({
    nullable: true,
  })
  title: string;

  @Column({
    nullable: true,
  })
  gender: string;

  @Column({
    nullable: true,
  })
  dob: Date;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    default: '',
    nullable: true,
  })
  address_two?: string;

  @Column({
    nullable: true,
  })
  city: string;

  @Column({
    nullable: true,
  })
  state: string;

  @Column({
    nullable: true,
  })
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

  @OneToOne(() => Patients, (patient) => patient.personalInfo, {
    onDelete: 'CASCADE',
  })
  patient?: Patients;

  @OneToOne(() => Admin, (admin) => admin.personalInfo)
  admin: Admin;
}
