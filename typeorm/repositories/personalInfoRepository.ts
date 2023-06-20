import {AppDataSource} from "../../data-source";
import {PersonalInformation} from "../entity/personaInfo";

export const personalInfoRepo = () => {
  return AppDataSource.getRepository(PersonalInformation);
}