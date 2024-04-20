import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Provider } from '@typeorm/entity/providers';
import { Site } from '@typeorm/entity/site';
import { z } from 'zod';
import { createAndUpdateRoleRequestSchema } from '@lib/schemas/roleSchemas';

@Entity({ name: 'roles' })
export class Roles {
  constructor(data: z.infer<typeof createAndUpdateRoleRequestSchema>) {
    this.description = data?.description as string;
    this.name = data?.name as string;
    this.siteId = data?.siteId as string;
    this.prescription = data?.prescription as boolean;
    this.note = data?.note as boolean;
    this.procedure = data?.procedure as boolean;
    this.lab_test = data?.lab_test as boolean;
    this.appointment = data?.appointment as boolean;
    this.vitals = data?.vitals as boolean;
    this.med_supply = data?.med_supply as boolean;
    this.admit_patient = data?.admit_patient as boolean;
    this.transfer_patient = data?.transfer_patient as boolean;
    this.move_patient = data?.move_patient as boolean;
    this.discharge = data?.discharge as boolean;
    this.time_of_death = data?.time_of_death as boolean;
    this.review = data?.review as boolean;
    this.logs = data?.logs as boolean;
    this.dental = data?.dental as boolean;
    this.clerking = data?.clerking as boolean;
    this.radiology = data?.radiology as boolean;
    this.consult = data?.consult as boolean;
    this.referral = data?.referral as boolean;
    this.refer_outpx = data?.refer_outpx as boolean;
    this.upload = data?.upload as boolean;
    this.charts = data?.charts as boolean;
    this.nursing = data?.nursing as boolean;
    this.plan = data?.plan as boolean;
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
  name: string;

  // Boolean Start
  @Column({
    nullable: false,
    default: false,
  })
  prescription: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  note: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  plan: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  procedure: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  lab_test: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  appointment: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  vitals: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  med_supply: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  admit_patient: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  transfer_patient: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  move_patient: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  discharge: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  time_of_death: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  review: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  logs: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  dental: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  clerking: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  radiology: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  consult: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  referral: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  refer_outpx: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  upload: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  charts: boolean;

  @Column({
    nullable: false,
    default: false,
  })
  nursing: boolean;
  // Boolean End

  @Column({
    nullable: false,
  })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany((type) => Provider, (provider) => provider.primary_role)
  providers: Provider[];

  @ManyToOne((type) => Site, (site) => site.roles)
  site: Site;
}
