import { AppDataSource } from '../../data-source';
import { Patients } from '@typeorm/entity/patient';

export const patientRepo = () => {
  return AppDataSource.getRepository(Patients);
};
