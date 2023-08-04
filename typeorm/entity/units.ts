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
    this.total_beds = data?.total_beds as number;
    this.occupied_beds = data?.occupied_beds as number;
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

  @Column({
    nullable: false,
    default: 0,
  })
  total_beds: number;

  @Column({
    nullable: false,
    default: 0,
  })
  occupied_beds: number;

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
