import { personalInfoRepo } from '../typeorm/repositories/personalInfoRepository';
import { ProfileInfoModelProps } from '../types';
import { PersonalInformation } from '../typeorm/entity/personaInfo';

export const getPersonalInfoByPhone = async (phone: string) => {
  const personalInfoRepository = personalInfoRepo();

  return await personalInfoRepository.findOneBy({
    phone,
  });
};

export const createNewPersonalInfo = async (data: ProfileInfoModelProps) => {
  const personalInfoRepository = personalInfoRepo();
  const personalInformation = new PersonalInformation(data);

  await personalInfoRepository.save(personalInformation);

  return personalInformation;
};

export const getPersonalInfoCountByPhone = async (phone: string) => {
  const personalInfoRepository = personalInfoRepo();

  return await personalInfoRepository.count({
    where: {
      phone,
    },
  });
};
