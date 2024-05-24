import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Site } from '@typeorm/entity/site';
import { Provider } from '@typeorm/entity/providers';
import { Patients } from '@typeorm/entity/patient';
import { z } from 'zod';
import { createDepartmentRequestSchema } from '@lib/schemas/departmentSchemas';

@Entity({
  name: 'department',
})
export class Departments {
  constructor(data: z.infer<typeof createDepartmentRequestSchema>) {
    this.name = data?.name;
    this.siteId = data?.siteId;
    this.description = data?.description;
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
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Provider, (provider) => provider.department, {
    onDelete: 'CASCADE',
  })
  providers: Provider[];

  @OneToMany(() => Patients, (patients) => patients.department, {
    onDelete: 'CASCADE',
  })
  patients: Patients[];

  @ManyToOne(() => Site, (site) => site.departments)
  site: Site;
}
