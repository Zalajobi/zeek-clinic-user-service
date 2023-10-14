import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Site } from '@typeorm/entity/site';
import { AdminModelProps } from '@typeorm/objectsTypes/adminObjectTypes';
import { AdminRoles } from '@typeorm/entity/enums';
import { PersonalInformation } from '@typeorm/entity/personaInfo';

@Entity()
export class Admin {
  constructor(data: AdminModelProps) {
    this.siteId = data?.siteId as string;
    this.role = data?.role as AdminRoles;
    this.email = data?.email as string;
    this.password = data?.password as string;
    this.username = data?.username as string;
    this.staff_id = data?.staff_id as string;
    this.password_reset_request_timestamp =
      data?.password_reset_request_timestamp as Date;
    // this.personalInfoId = data?.personalInfoId as string
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  siteId: string;

  // @Column({
  //   nullable: true,
  // })
  // personalInfoId?: string;

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
    nullable: true,
  })
  password_reset_code: string;

  @Column({
    nullable: true,
  })
  password_reset_request_timestamp: Date;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => PersonalInformation, (personalInfo) => personalInfo.admin, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  personalInfo?: PersonalInformation;

  @ManyToOne((type) => Site, (site) => site.admins)
  site: Site;
}
