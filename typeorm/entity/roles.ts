import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Site} from "./site";
import {Provider} from "./providers";

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
  @OneToMany(type => Site, site => site.roles)
  providers: Provider

  @ManyToOne(type => Provider, provider => provider.primary_role)
  site: Site
}