import { AppDataSource } from '../../data-source';
import { PersonalInformation } from '@typeorm/entity/personaInfo';

export const personalInfoRepo = () => {
  return AppDataSource.getRepository(PersonalInformation);
};
