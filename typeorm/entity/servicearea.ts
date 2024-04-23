import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceAreaType } from '@typeorm/entity/enums';
import { Site } from '@typeorm/entity/site';
import { Provider } from '@typeorm/entity/providers';
import { Patients } from '@typeorm/entity/patient';
import { createServiceAreaRequestSchema } from '@lib/schemas/serviceAreaSchemas';
import { z } from 'zod';

@Entity({
  name: 'service_area',
})
export class Servicearea {
  constructor(data: z.infer<typeof createServiceAreaRequestSchema>) {
    this.name = data?.name;
    this.siteId = data?.siteId;
    this.description = data?.description;
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

  // Relations
  @OneToMany((type) => Patients, (patients) => patients.servicearea)
  patients: Patients[];

  @ManyToOne((type) => Site, (site) => site.serviceareas)
  site: Site;
}
