import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"
import {PrimaryAdminRoles} from "./enums";

@Entity()
export class SuperAdmin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    unique: true
  })
  email: string

  @Column({
    unique: true
  })
  username: string

  @Column({
    unique: true
  })
  phone_number: string

  @Column({
    unique: false
  })
  first_name: string

  @Column({
    unique: false
  })
  last_name: string

  @Column({
    nullable: true,
    unique: false
  })
  other_name: string

  @Column({
    unique: false,
    nullable: false,
    default: PrimaryAdminRoles.SUPER_ADMIN
  })
  role: PrimaryAdminRoles

  @Column({
    unique: false
  })
  password: string

  @CreateDateColumn()
  created_at?: Date

  @CreateDateColumn()
  updated_at: Date
}