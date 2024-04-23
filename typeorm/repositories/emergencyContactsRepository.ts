import { AppDataSource } from '../../data-source';
import { EmergencyContacts } from '@typeorm/entity/emergencyContacts';

export const emergencyContactsRepo = () => {
  return AppDataSource.getRepository(EmergencyContacts);
};
