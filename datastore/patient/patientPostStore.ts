import { patientRepo } from '@typeorm/repositories/patientRepository';
import { z } from 'zod';
import {
  createPatientRequestSchema,
  emergencyContactSchema,
  employerSchema,
} from '@lib/schemas/patientSchemas';
import { DefaultJsonResponse } from '@util/responses';
import { createEmployer } from '@datastore/employerStore';
import { Patients } from '@typeorm/entity/patient';
import { PatientEmployer } from '@typeorm/entity/patientEmployer';
import { batchSaveEmergencyContacts } from '@datastore/emergencyContactsStore';

export const createNewPatient = async (
  patientData: z.infer<typeof createPatientRequestSchema>,
  personalInfoData: any,
  employerData?: z.infer<typeof employerSchema>,
  emergencyContactsData?: z.infer<typeof emergencyContactSchema>[]
) => {
  let newEmployer: PatientEmployer | null = null,
    newPatient: Patients | null = null;
  const patientRepository = patientRepo();

  const patientCount = await patientRepository
    .createQueryBuilder('patient')
    .where('LOWER(patient.email) LIKE :email', {
      email: patientData.email,
    })
    .getCount();

  if (patientCount >= 1) {
    return DefaultJsonResponse('Patient with email address exist', null, false);
  }

  if (employerData) {
    newEmployer = await createEmployer(employerData);
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
