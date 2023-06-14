import {AppDataSource} from "../../data-source";
import {Site} from "../entity/site";

export const siteRepo = () => {
  return AppDataSource.getRepository(Site);
}