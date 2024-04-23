import { superAdminRepo } from '@typeorm/repositories/superAdminRepository';
import { SuperAdmin } from '@typeorm/entity/superAdmin';

export const getSuperAdminLoginData = async (
  value: string
): Promise<SuperAdmin | null> => {
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

export const getSuperAdminBaseData = async (
  id: string
): Promise<SuperAdmin | null> => {
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

export const getSuperAdminDataById = async (
  id: string
): Promise<SuperAdmin | null> => {
  const superAdminRepository = superAdminRepo();

  return await superAdminRepository.findOneBy({
    id,
  });
};
