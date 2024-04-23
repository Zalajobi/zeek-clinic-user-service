import { employerRepo } from '@typeorm/repositories/employerRepository';
import { z } from 'zod';
import { employerSchema } from '@lib/schemas/patientSchemas';
import { PatientEmployer } from '@typeorm/entity/patientEmployer';

export const createEmployer = async (
  employer: z.infer<typeof employerSchema>
) => {
  const employerRepository = employerRepo();

  return await employerRepository.save(new PatientEmployer(employer));
};
