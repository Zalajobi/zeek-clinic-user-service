import { AppDataSource } from '../../data-source';
import { Units } from '../entity/units';

export const unitRepo = () => {
  return AppDataSource.getRepository(Units);
};
