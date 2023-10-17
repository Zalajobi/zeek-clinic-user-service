import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceAreaType } from '@typeorm/entity/enums';
import { CreateServiceAreaDataProps } from '@typeorm/objectsTypes/serviceAreaObjectType';
import { Site } from '@typeorm/entity/site';
import { Provider } from '@typeorm/entity/providers';
import { Patients } from '@typeorm/entity/patient';

@Entity({
  name: 'service_area',
})
export class Servicearea {
  constructor(data: CreateServiceAreaDataProps) {
    this.name = data?.name;
    this.siteId = data?.siteId;
    this.description = data?.description;
    this.type = data?.type;
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

  // Relations
  @OneToMany((type) => Patients, (patients) => patients.servicearea)
  patients: Patients[];

  @ManyToOne((type) => Site, (site) => site.serviceareas)
  site: Site;
}
