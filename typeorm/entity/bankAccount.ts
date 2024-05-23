import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Site } from '@typeorm/entity/site';

@Entity({
  name: 'bankAccount',
})
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  siteId: string;

  @Column()
  bank_name: string;

  @Column()
  account_number: string;

  @Column()
  currency: string;

  @Column()
  country: string;

  @Column()
  account_officer?: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Site, (site) => site.bankAccounts)
  site: Site;
}
