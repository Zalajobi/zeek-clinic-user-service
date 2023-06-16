import {AppDataSource} from "../../data-source";
import {Admin} from "../entity/admin";

export const adminRepo = () => {
  return AppDataSource.getRepository(Admin);
}