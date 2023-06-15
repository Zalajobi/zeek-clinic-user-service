import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {createDepartmentProps} from "../../types";
import {Site} from "./site";
import {Provider} from "./providers";

@Entity()
export class Departments {
  constructor(data:createDepartmentProps) {
    this.name = data?.name as string
    this.siteId = data?.siteId as string
    this.description = data?.description as string
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false
  })
  siteId: string

  @Column({
    nullable: false,
  })
  description: string

  @Column({
    nullable: false,
  })
  name: string

  @CreateDateColumn()
  created_at?: Date

  @CreateDateColumn()
  updated_at: Date

  // Relations
  @OneToMany(type => Provider, provider => provider.department)
  providers: Provider[]

  @ManyToOne(type => Site, site => site.departments)
  site: Site
}