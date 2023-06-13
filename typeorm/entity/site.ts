import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, PrimaryColumn, ManyToOne } from "typeorm"
import {Hospital} from "./hospital";
import {SiteStatus} from "./enums";

@Entity()
export class Site {

  // constructor() {
  //   this.id = uuid();
  // }

  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    nullable: false
  })
  address: string

  @Column({
    nullable: false
  })
  name: string

  @Column({
    unique: true,
    nullable: false
  })
  email: string

  @Column({
    nullable: false
  })
  city: string

  @Column({
    nullable: false
  })
  state: string

  @Column({
    nullable: false
  })
  country: string

  @Column({
    nullable: true
  })
  logo?: string

  @Column({
    nullable: true
  })
  time_zone?: string

  @Column({
    nullable: false
  })
  phone: string

  @Column({
    nullable: false,
    default: SiteStatus.PENDING
  })
  status: string

  @Column({
    nullable: false,
    default: false
  })
  is_private: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_appointment: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_caregiver: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_clinical: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_doctor: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_emergency: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_laboratory: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_medical_supply: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_nursing: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_inpatient: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_outpatient: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_pharmacy: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_physical_therapy: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_procedure: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_radiology: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_unit: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_vital: boolean

  @Column({
    nullable: false,
    default: false
  })
  has_wallet: boolean

  @CreateDateColumn()
  created_at?: Date

  @CreateDateColumn()
  updated_at: Date

  // Relations
  @ManyToOne(type => Hospital, hospital => hospital.sites)
  hospital: Hospital
}