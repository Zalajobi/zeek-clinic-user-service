import {SuperAdmin} from "../entity/superAdmin";
import {AppDataSource} from "../../data-source";

export const superAdminRepo = () => {
  return AppDataSource.getRepository(SuperAdmin);
}