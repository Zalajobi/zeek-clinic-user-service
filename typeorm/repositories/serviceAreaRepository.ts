import { AppDataSource } from '../../data-source';
import { Servicearea } from '@typeorm/entity/servicearea';

export const serviceAreaRepo = () => {
  return AppDataSource.getRepository(Servicearea);
};
