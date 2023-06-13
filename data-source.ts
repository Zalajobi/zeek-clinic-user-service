import "reflect-metadata"
import { DataSource } from "typeorm"
import {Hospital} from "./typeorm/entity/hospital";
import {Site} from "./typeorm/entity/site";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "zeek-clinic-user-service",
  synchronize: true,
  logging: false,
  entities: [Hospital, Site],
  migrations: [],
  subscribers: [],
})
