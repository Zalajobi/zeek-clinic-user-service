import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patients } from '@typeorm/entity/patient';
import { Provider } from '@typeorm/entity/providers';
import { Site } from '@typeorm/entity/site';
import { createUnitRequestSchema } from '@lib/schemas/unitSchemas';
import { z } from 'zod';

@Entity({
  name: 'unit',
})
export class Units {
  constructor(data: z.infer<typeof createUnitRequestSchema>) {
    this.name = data?.name;
    this.siteId = data?.siteId;
    this.description = data?.description;
    this.total_beds = data?.total_beds;
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
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Provider, (provider) => provider.unit, {
    onDelete: 'CASCADE',
  })
  providers: Provider[];

  @OneToMany(() => Patients, (patient) => patient.unit, {
    onDelete: 'CASCADE',
  })
  patients: Patients[];

  @ManyToOne(() => Site, (site) => site.departments)
  site: Site;
}
