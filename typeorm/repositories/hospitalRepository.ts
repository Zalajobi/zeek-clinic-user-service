import { AppDataSource } from '../../data-source';
import { Hospital } from '@typeorm/entity/hospital';

export const hospitalRepo = () => {
  return AppDataSource.getRepository(Hospital);
};
