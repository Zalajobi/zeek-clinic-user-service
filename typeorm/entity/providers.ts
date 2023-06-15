import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Site} from "./site";
import {Roles} from "./roles";
import {Departments} from "./departments";

@Entity()
export class Provider {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false
  })
  siteId: string

  @Column({
    nullable: false
  })
  primaryRoleId: string

  @Column({
    nullable: false
  })
  departmentId: string

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

  @Column({
    default: false
  })
  is_consultant: boolean

  @CreateDateColumn()
  created_at?: Date

  @CreateDateColumn()
  updated_at: Date

  // Relations
  @ManyToOne(type => Site, site => site.roles)
  site: Site;

  @ManyToOne(type => Roles, roles => roles.providers)
  primary_role: Roles

  @ManyToOne(type => Departments, department => department.providers)
  department: Departments

  /*
   To Include
   type
   department
   unit
   appointments
   role

   */
}