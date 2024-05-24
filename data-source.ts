import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Hospital } from '@typeorm/entity/hospital';
import { Site } from '@typeorm/entity/site';
import { BankAccount } from '@typeorm/entity/bankAccount';

import { SuperAdmin } from '@typeorm/entity/superAdmin';
import { Provider } from '@typeorm/entity/providers';
import { Roles } from '@typeorm/entity/roles';
import { Departments } from '@typeorm/entity/departments';
import { Admin } from '@typeorm/entity/admin';
import { Units } from '@typeorm/entity/units';
import { Servicearea } from '@typeorm/entity/servicearea';
import { Patients } from '@typeorm/entity/patient';
import { EmergencyContacts } from '@typeorm/entity/emergencyContacts';
import { PatientEmployer } from '@typeorm/entity/patientEmployer';

import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USERNAME,
} from '@util/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  synchronize: true,
  logging: false,
  // logging: "all",
  migrationsTableName: 'migrations',
  entities: [
    Hospital,
    Site,
    BankAccount,
    SuperAdmin,
    Provider,
    Roles,
    Departments,
    Admin,
    Units,
    Servicearea,
    Patients,
    EmergencyContacts,
    PatientEmployer,
  ],
  migrations: [
    Hospital,
    Site,
    BankAccount,
    SuperAdmin,
    Provider,
    Roles,
    Departments,
    Admin,
    Units,
    Servicearea,
    Patients,
    EmergencyContacts,
    PatientEmployer,
  ],
  subscribers: [],
});
