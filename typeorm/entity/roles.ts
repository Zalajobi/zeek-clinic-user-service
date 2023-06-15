import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm"
import {Site} from "./site";

@Entity({name: 'roles'})
export class Roles {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false
  })
  siteId: string

  @Column({
    nullable: false,
  })
  name: string

  @Column({
    nullable: false,
  })
  description: string

  @CreateDateColumn()
  created_at?: Date

  @CreateDateColumn()
  updated_at: Date

  // Relations
  @ManyToOne(type => Site, site => site.roles)
  site: Site
}