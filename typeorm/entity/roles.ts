import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Site } from './site';
import { Provider } from './providers';
import { roleModelProps } from '../../types';

@Entity({ name: 'roles' })
export class Roles {
  constructor(data: roleModelProps) {
    this.description = data?.description as string;
    this.name = data?.name as string;
    this.siteId = data?.siteId as string;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  siteId: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany((type) => Provider, (provider) => provider.primary_role)
  providers: Provider[];

  @ManyToOne((type) => Site, (site) => site.roles)
  site: Site;
}
