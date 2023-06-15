import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Site} from "./site";
import {AdminRoles} from "./enums";

@Entity()
export class Admin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false
  })
  siteId: string

  @Column({
    type: 'enum',
    enum: AdminRoles,
    unique: false,
    nullable: false,
  })
  role: AdminRoles

  @Column({
    unique: true,
    nullable: false
  })
  email: string

  @Column({
    nullable: false
  })
  password: string

  @Column({
    unique: true,
    nullable: false
  })
  username: string

  @Column({
    nullable: false
  })
  staff_id: string

  @CreateDateColumn()
  created_at?: Date

  @CreateDateColumn()
  updated_at: Date

  // Relations
  @ManyToOne(type => Site, site => site.admins)
  site: Site;

}