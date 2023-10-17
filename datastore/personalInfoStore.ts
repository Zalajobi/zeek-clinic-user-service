import { personalInfoRepo } from '@typeorm/repositories/personalInfoRepository';
import { ProfileInfoModelProps } from '../types';
import { PersonalInformation } from '@typeorm/entity/personaInfo';
import { AppDataSource } from '../data-source';

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

export const getPersonalInfoCountByPhoneAndNotSameId = async (
  phone: string,
  id: string
) => {
  const personalInfoRepository = personalInfoRepo();

  return await personalInfoRepository
    .createQueryBuilder('personalInfo')
    .where('personalInfo.phone = :phone and personalInfo.id != :id', {
      phone,
      id,
    })
    .getCount();
};

export const updatePersonalInfoById = async (
  id: string,
  personalInfoData: Record<string, any>
) => {
  return await AppDataSource.createQueryBuilder()
    .update(PersonalInformation)
    .set(personalInfoData)
    .where('id = :id', { id })
    .execute();
};
