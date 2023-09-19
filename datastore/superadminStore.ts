import { superAdminRepo } from '@typeorm/repositories/superAdminRepository';
import { SuperAdminEntityObject } from '@typeorm/objectsTypes/superadminObjectTypes';

export const getSuperadminLoginData = async (value: string) => {
  const superAdminRepository = superAdminRepo();

  return await superAdminRepository.findOne({
    where: [
      {
        email: value,
      },

      {
        username: value,
      },
    ],

    select: {
      email: true,
      id: true,
      password: true,
      role: true,
    },
  });
};

export const getSuperadminBaseData = async (id: string) => {
  const superAdminRepository = superAdminRepo();

  return await superAdminRepository.findOne({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      username: true,
      phone_number: true,
      first_name: true,
      last_name: true,
      other_name: true,
    },
  });
};

export const getSuperadminDataById = async (id: string) => {
  const superAdminRepository = superAdminRepo();

  return <SuperAdminEntityObject>await superAdminRepository.findOneBy({
    id,
  });
};
