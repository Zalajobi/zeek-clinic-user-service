import { AppDataSource } from '../../data-source';
import { Patients } from '../entity/patient';

export const patientRepo = () => {
  return AppDataSource.getRepository(Patients);
};
