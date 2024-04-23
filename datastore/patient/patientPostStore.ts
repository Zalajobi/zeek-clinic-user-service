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
import { createEmployer } from '@datastore/employerStore';
import { Patients } from '@typeorm/entity/patient';
import { PatientEmployer } from '@typeorm/entity/patientEmployer';
import { batchSaveEmergencyContacts } from '@datastore/emergencyContactsStore';

export const createNewPatient = async (
  patientData: z.infer<typeof createPatientRequestSchema>,
  personalInfoData: z.infer<typeof profileDataRequestSchema>,
  employerData?: z.infer<typeof employerSchema>,
  emergencyContactsData?: z.infer<typeof emergencyContactSchema>[]
) => {
  let newEmployer: PatientEmployer | null = null,
    newPatient: Patients | null = null;
  const patientRepository = patientRepo();

  const [infoCountByPhone, patientCount] = await Promise.all([
    getPersonalInfoCountByPhone(personalInfoData.phone),

    patientRepository
      .createQueryBuilder('patient')
      .where('LOWER(patient.email) LIKE :email', {
        email: patientData.email,
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

  if (employerData) {
    newEmployer = await createEmployer(employerData);
  }
  const personalInfo = await createNewPersonalInfo(personalInfoData);

  if (personalInfo) {
    const patient = new Patients(patientData);
    patient.personalInfo = personalInfo;

    // New Employer
    if (newEmployer) patient.employer = newEmployer;

    newPatient = await patientRepository.save(patient);
  }

  if (newPatient && emergencyContactsData) {
    emergencyContactsData?.map(
      (contact) => (contact.patientId = newPatient?.id)
    );
    await batchSaveEmergencyContacts(emergencyContactsData);
  }

  return DefaultJsonResponse(
    newPatient ? 'New Patient Created' : 'Something Went Wrong',
    null,
    !!newPatient
  );
};
