import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm"
import {HospitalStatus} from "./enums";
import {Site} from "./site";

@Entity()
export class Hospital {
  // constructor() {
  //   this.id = uuid();
  //   this.name = '';
  //   this.email = '';
  //   this.site_count = 0;
  //   this.phone = '';
  //   this.address = '';
  //   this.city = '';
  //   this.state = '';
  //   this.country = '';
  //   this.logo = '';
  //   this.status = HospitalStatus.PENDING;
  //   this.zip_code = '';
  //   this.country_code = '';
  //   this.created_at = new Date();
  //   this.updated_at = new Date();
  // }

  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({nullable: false})
  name: string

  @Column({
    unique: true,
    nullable:false
  })
  email: string

  @Column({
    default: 0,
    nullable:false
  })
  site_count: number

  @Column({
    nullable: false
  })
  phone: string

  @Column({
    nullable: false
  })
  address: string

  @Column({
    nullable: true
  })
  city?: string

  @Column({
    nullable: true
  })
  state?: string

  @Column({
    nullable: false
  })
  country: string

  @Column({
    nullable: true
  })
  logo?: string

  @Column({
    nullable: false,
    type: "enum",
    enum: HospitalStatus,
    default: HospitalStatus.PENDING
  })
  status: string

  @Column({
    nullable: true
  })
  zip_code?: string

  @Column({
    nullable: true
  })
  country_code?: string

  @CreateDateColumn()
  created_at?: Date

  @CreateDateColumn()
  updated_at: Date

  // Relations
  @OneToMany(type => Site, site => site.hospital, {onDelete: 'CASCADE'})
  sites: Site[]
}