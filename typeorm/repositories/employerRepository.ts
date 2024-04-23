import { AppDataSource } from '../../data-source';
import { PatientEmployer } from '@typeorm/entity/patientEmployer';

export const employerRepo = () => {
  return AppDataSource.getRepository(PatientEmployer);
};
