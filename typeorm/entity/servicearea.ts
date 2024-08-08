import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ServiceAreaType } from '@typeorm/entity/enums';
import { Site } from '@typeorm/entity/site';
import { Provider } from '@typeorm/entity/providers';
import { Patients } from '@typeorm/entity/patient';
import { createServiceAreaRequestSchema } from '../../schemas/serviceAreaSchemas';
import { z } from 'zod';

@Entity({
  name: 'serviceArea',
})
@Unique(['siteId', 'name', 'type'])
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
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Provider, (provider) => provider.serviceArea, {
    onDelete: 'CASCADE',
  })
  providers: Provider[];

  // Relations
  @OneToMany(() => Patients, (patients) => patients.serviceArea, {
    onDelete: 'CASCADE',
  })
  patients: Patients[];

  @ManyToOne(() => Site, (site) => site.serviceareas)
  site: Site;
}
