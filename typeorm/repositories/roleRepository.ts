import {AppDataSource} from "../../data-source";
import {Roles} from "../entity/roles";

export const roleRepo = () => {
  return AppDataSource.getRepository(Roles);
}