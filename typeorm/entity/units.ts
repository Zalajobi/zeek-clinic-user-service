import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Provider } from './providers';
import { Site } from './site';
import { createUnitDataProps } from '../objectsTypes/unitObjectTypes';

@Entity()
export class Units {
  constructor(data: createUnitDataProps) {
    this.name = data?.name as string;
    this.siteId = data?.siteId as string;
    this.description = data?.description as string;
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
  description: string;

  @Column({
    nullable: false,
  })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany((type) => Provider, (provider) => provider.unit)
  providers: Provider[];

  @ManyToOne((type) => Site, (site) => site.departments)
  site: Site;
}
