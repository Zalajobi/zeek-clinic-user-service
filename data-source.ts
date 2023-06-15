import "reflect-metadata"
import { DataSource } from "typeorm"
import {Hospital} from "./typeorm/entity/hospital";
import {Site} from "./typeorm/entity/site";
import {BankAccount} from "./typeorm/entity/bankAccount";
import {SuperAdmin} from "./typeorm/entity/superAdmin";
import {Provider} from "./typeorm/entity/providers";
import {PersonalInformation} from "./typeorm/entity/personaInfo";
import {Roles} from "./typeorm/entity/roles";
import {Departments} from "./typeorm/entity/departments";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "zeek-clinic-user-service",
  synchronize: true,
  logging: false,
  entities: [Hospital, Site, BankAccount, SuperAdmin, Provider, PersonalInformation, Roles, Provider, Departments],
  migrations: [],
  subscribers: [],
})
