import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Site} from "./site";

@Entity()
export class Provider {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false
  })
  siteId: string

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

  /*
   To Include
   type
   department
   unit
   appointments
   role

   */
}