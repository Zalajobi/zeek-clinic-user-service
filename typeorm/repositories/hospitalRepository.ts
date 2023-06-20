import {AppDataSource} from "../../data-source";
import {Hospital} from "../entity/hospital";

export const hospitalRepo = () => {
  return AppDataSource.getRepository(Hospital);
}