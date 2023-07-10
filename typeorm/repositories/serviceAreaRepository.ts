import { AppDataSource } from '../../data-source';
import { Servicearea } from '../entity/servicearea';

export const serviceAreaRepo = () => {
  return AppDataSource.getRepository(Servicearea);
};
