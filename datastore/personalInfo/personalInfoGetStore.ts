import { personalInfoRepo } from '@typeorm/repositories/personalInfoRepository';

export const getPersonalInfoByPhone = async (phone: string) => {
  const personalInfoRepository = personalInfoRepo();

  return await personalInfoRepository.findOneBy({
    phone,
  });
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
