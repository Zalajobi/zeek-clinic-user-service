import { ProfileInfoModelProps } from '@typeDesc/index';
import { personalInfoRepo } from '@typeorm/repositories/personalInfoRepository';
import { PersonalInformation } from '@typeorm/entity/personaInfo';
import { AppDataSource } from '../../data-source';

export const updatePersonalInfoById = async (
  id: string,
  personalInfoData: Record<string, any>
) => {
  return await AppDataSource.createQueryBuilder()
    .update(PersonalInformation)
    .set(personalInfoData)
    .where('id = :id', { id })
    .execute();
};