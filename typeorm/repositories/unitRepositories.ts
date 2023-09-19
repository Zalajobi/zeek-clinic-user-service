import { AppDataSource } from '../../data-source';
import { Units } from '@typeorm/entity/units';

export const unitRepo = () => {
  return AppDataSource.getRepository(Units);
};
