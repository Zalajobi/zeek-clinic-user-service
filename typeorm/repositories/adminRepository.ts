import { AppDataSource } from '../../data-source';
import { Admin } from '@typeorm/entity/admin';

export const adminRepo = () => {
  return AppDataSource.getRepository(Admin);
};
