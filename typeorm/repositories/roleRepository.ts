import { AppDataSource } from '../../data-source';
import { Roles } from '@typeorm/entity/roles';

export const roleRepo = () => {
  return AppDataSource.getRepository(Roles);
};
