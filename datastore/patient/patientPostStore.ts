import { patientRepo } from '@typeorm/repositories/patientRepository';
import { getPersonalInfoCountByPhone } from '@datastore/personalInfo/personalInfoGetStore';
import { z } from 'zod';
import { profileDataRequestSchema } from '@lib/schemas/adminSchemas';
import {
  createPatientRequestSchema,
  emergencyContactSchema,
  employerSchema,
} from '@lib/schemas/patientSchemas';
import { DefaultJsonResponse } from '@util/responses';
import { createNewPersonalInfo } from '@datastore/personalInfo/personalInfoPost';

export const createNewPatient = async (
  patient: z.infer<typeof createPatientRequestSchema>,
  personalInfo: z.infer<typeof profileDataRequestSchema>,
  employer?: z.infer<typeof employerSchema>,
  emergencyContacts?: z.infer<typeof emergencyContactSchema>[]
) => {
  let newEmployer = null;
  const patientRepository = patientRepo();

  const [infoCountByPhone, patientCount] = await Promise.all([
    getPersonalInfoCountByPhone(personalInfo.phone),

    patientRepository
      .createQueryBuilder('patient')
      .where('LOWER(patient.email) LIKE :email', {
        email: patient.email,
      })
      .getCount(),
  ]);

  if (infoCountByPhone >= 1) {
    return DefaultJsonResponse(
      'User with phone number already exists',
      null,
      false
    );
  }

  if (patientCount >= 1) {
    return DefaultJsonResponse('Patient with email address exist', null, false);
  }

  if (employer) {
    // newEmployer =
  }

  const newPersonalInfo = await createNewPersonalInfo(personalInfo);

  return {
    infoCountByPhone,
    patientCount,
  };
};
