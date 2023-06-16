import {personalInfoRepo} from "../typeorm/repositories/personalInfoRepository";
import {profileInfoModelProps} from "../types";
import {PersonalInformation} from "../typeorm/entity/personaInfo";

export const getPersonalInfoByPhone = async (phone:string) => {
  const personalInfoRepository = personalInfoRepo();

  return await personalInfoRepository.findOneBy({
    phone
  })
}

export const createNewPersonalInfo = async (data:profileInfoModelProps) => {
  const personalInfoRepository = personalInfoRepo();

  return await personalInfoRepository.save(new PersonalInformation(data))
}