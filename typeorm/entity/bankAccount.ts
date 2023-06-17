import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm"
import {Site} from "./site";

@Entity()
export class BankAccount {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false
  })
  siteId: string

  @Column()
  bank_name: string

  @Column()
  account_number: string

  @Column()
  currency: string

  @Column()
  country: string

  @Column()
  account_officer?: string

  @CreateDateColumn()
   created_at: Date

  @CreateDateColumn()
  updated_at: Date

  @ManyToOne(type => Site, site => site.bankAccounts)
  site: Site;
}