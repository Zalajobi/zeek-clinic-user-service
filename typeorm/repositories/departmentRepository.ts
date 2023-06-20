import {AppDataSource} from "../../data-source";
import {Departments} from "../entity/departments";

export const departmentRepo = () => {
  return AppDataSource.getRepository(Departments);
}