import { ProfileInfoModelProps } from '@typeDesc/index';
import { personalInfoRepo } from '@typeorm/repositories/personalInfoRepository';
import { PersonalInformation } from '@typeorm/entity/personaInfo';

export const createNewPersonalInfo = async (data: ProfileInfoModelProps) => {
  const personalInfoRepository = personalInfoRepo();
  const personalInformation = new PersonalInformation(data);

  await personalInfoRepository.save(personalInformation);

  return personalInformation;
};
