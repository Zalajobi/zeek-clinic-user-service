import { AppDataSource } from '../../data-source';
import { SuperAdmin } from '@typeorm/entity/superAdmin';

export const superAdminRepo = () => {
  return AppDataSource.getRepository(SuperAdmin);
};
