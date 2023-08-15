import { patientRepo } from '../typeorm/repositories/patientRepository';

export const getPatientCountByProviderId = async (providerId: string) => {
  const patientRepository = patientRepo();

  return patientRepository
    .createQueryBuilder('patient')
    .where('patient.careGiverId = :careGiverId', {
      careGiverId: providerId,
    })
    .getCount();
};
