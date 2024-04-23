import { emergencyContactsRepo } from '@typeorm/repositories/emergencyContactsRepository';
import { emergencyContactSchema } from '@lib/schemas/patientSchemas';
import { z } from 'zod';

export const batchSaveEmergencyContacts = async (
  contacts: z.infer<typeof emergencyContactSchema>[]
) => {
  const emergencyContactRepository = emergencyContactsRepo();

  return await emergencyContactRepository.save(contacts);
};
