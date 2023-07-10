import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceAreaType } from './enums';
import { CreateServiceAreaDataProps } from '../objectsTypes/serviceAreaObjectType';
import { Provider } from './providers';
import { Site } from './site';

@Entity({
  name: 'service_area',
})
export class Servicearea {
  constructor(data: CreateServiceAreaDataProps) {
    this.name = data?.name as string;
    this.siteId = data?.siteId as string;
    this.description = data?.description as string;
    this.type = data?.type as ServiceAreaType;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  siteId: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ServiceAreaType,
    default: ServiceAreaType.OTHERS,
    nullable: false,
  })
  type: ServiceAreaType;

  @Column({
    nullable: false,
  })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany((type) => Provider, (provider) => provider.servicearea)
  providers: Provider[];

  @ManyToOne((type) => Site, (site) => site.serviceareas)
  site: Site;
}
