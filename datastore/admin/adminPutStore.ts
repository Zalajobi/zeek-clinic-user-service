import { adminRepo } from '@typeorm/repositories/adminRepository';
import { AdminModelProps } from '@typeorm/objectsTypes/adminObjectTypes';

export const updateAdminPasswordByAdminId = async (
  id: string,
  password: string
) => {
  const adminRepository = adminRepo();

  return await adminRepository.update(
    {
      id,
    },
    {
      password,
    }
  );
};

export const updateAdminData = async (id: string, data: AdminModelProps) => {
  const adminRepository = adminRepo();

  return await adminRepository.update(
    {
      id,
    },
    data
  );
};
