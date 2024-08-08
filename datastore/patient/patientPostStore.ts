import { patientRepo } from '@typeorm/repositories/patientRepository';
import { z } from 'zod';
import {
  createPatientRequestSchema,
  emergencyContactSchema,
  employerSchema,
} from '../../schemas/patientSchemas';
import { DefaultJsonResponse } from '@util/responses';
import { createEmployer } from '@datastore/employerStore';
import { Patients } from '@typeorm/entity/patient';
import { PatientEmployer } from '@typeorm/entity/patientEmployer';
import { batchSaveEmergencyContacts } from '@datastore/emergencyContactsStore';

export const createNewPatient = async (
  patientData: z.infer<typeof createPatientRequestSchema>,
  employerData?: z.infer<typeof employerSchema>,
  emergencyContactsData?: z.infer<typeof emergencyContactSchema>[]
) => {
  const patientRepository = patientRepo();
  let newEmployer: PatientEmployer | null = null,
    newPatient: Patients | null = null;

  const [uniquePhone, uniqueEmail, uniqueCardNumber] = await Promise.all([
    patientRepository.countBy({
      phone: patientData.phone,
      siteId: patientData.siteId,
    }),

    patientRepository
      .createQueryBuilder('patient')
      .where('LOWER(patient.email) LIKE :email', {
        email: patientData.email.toLowerCase(),
      })
      .andWhere('patient.siteId = :siteId', {
        siteId: patientData.siteId,
      })
      .getCount(),

    patientRepository
      .createQueryBuilder('patient')
      .where('patient.cardNumber = :cardNumber', {
        cardNumber: patientData.cardNumber,
      })
      .andWhere('patient.siteId = :siteId', {
        siteId: patientData.siteId,
      })
      .getCount(),
  ]);

  if (uniqueEmail >= 1) throw new Error('Patient with email address exist');

  if (uniquePhone >= 1) throw new Error('Patient with phone number exist');

  if (uniqueCardNumber >= 1) throw new Error('Patient with card number exist');

  // Create patient object
  const patient = new Patients(patientData);

  // Save employer data
  if (employerData) {
    newEmployer = await createEmployer(employerData);
    patient.employer = newEmployer;
  }

  // Save patient data
  newPatient = await patientRepository.save(patient);

  if (newPatient && emergencyContactsData) {
    emergencyContactsData?.map((contact) => {
      contact.patientId = newPatient?.id;
    });
    await batchSaveEmergencyContacts(emergencyContactsData);
  }

  return DefaultJsonResponse(
    newPatient ? 'New Patient Created' : 'Something Went Wrong',
    null,
    !!newPatient
  );
};
