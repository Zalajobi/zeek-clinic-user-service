import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Hospital } from '@typeorm/entity/hospital';
import { Site } from '@typeorm/entity/site';
import { BankAccount } from '@typeorm/entity/bankAccount';

import { SuperAdmin } from '@typeorm/entity/superAdmin';
import { Provider } from '@typeorm/entity/providers';
import { PersonalInformation } from '@typeorm/entity/personaInfo';
import { Roles } from '@typeorm/entity/roles';
import { Departments } from '@typeorm/entity/departments';
import { Admin } from '@typeorm/entity/admin';
import { Units } from '@typeorm/entity/units';
import { Servicearea } from '@typeorm/entity/servicearea';
import { Patients } from '@typeorm/entity/patient';
import { EmergencyContacts } from '@typeorm/entity/emergencyContacts';
import { PatientEmployer } from '@typeorm/entity/patientEmployer';

// Using environment variables
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST_LOCAL,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME_LOCAL,
  password: process.env.DATABASE_PASSWORD_LOCAL,
  database: process.env.DATABASE_NAME_LOCAL,
  synchronize: true,
  logging: false,
  entities: [
    Hospital,
    Site,
    BankAccount,
    SuperAdmin,
    Provider,
    PersonalInformation,
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
    PersonalInformation,
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
