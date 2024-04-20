import { personalInfoRepo } from '@typeorm/repositories/personalInfoRepository';
import { PersonalInformation } from '@typeorm/entity/personaInfo';
import { profileDataRequestSchema } from '@lib/schemas/adminSchemas';
import { z } from 'zod';

export const createNewPersonalInfo = async (
  data: z.infer<typeof profileDataRequestSchema>
) => {
  const personalInfoRepository = personalInfoRepo();
  const personalInformation = new PersonalInformation(data);

  await personalInfoRepository.save(personalInformation);

  return personalInformation;
};
