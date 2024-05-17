import { AppDataSource } from '../../data-source';
import { PersonalInformation } from '@typeorm/entity/personalInfo';

export const personalInfoRepo = () => {
  return AppDataSource.getRepository(PersonalInformation);
};
