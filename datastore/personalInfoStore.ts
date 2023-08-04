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

  return await personalInfoRepository.save(new PersonalInformation(data));
};

export const getPersonalInfoCountByPhone = async (phone: string) => {
  const personalInfoRepository = personalInfoRepo();

  return await personalInfoRepository.count({
    where: {
      phone,
    },
  });
};
