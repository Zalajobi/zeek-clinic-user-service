import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { createUnitDataProps } from '@typeorm/objectsTypes/unitObjectTypes';
import { Patients } from '@typeorm/entity/patient';
import { Provider } from '@typeorm/entity/providers';
import { Site } from '@typeorm/entity/site';

@Entity()
export class Units {
  constructor(data: createUnitDataProps) {
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
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany((type) => Provider, (provider) => provider.unit)
  providers: Provider[];

  @OneToMany((type) => Patients, (patient) => patient.unit)
  patients: Patients[];

  @ManyToOne((type) => Site, (site) => site.departments)
  site: Site;
}
