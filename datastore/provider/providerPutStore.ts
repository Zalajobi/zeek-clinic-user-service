import { providerRepo } from '@typeorm/repositories/providerRepository';
import { isObjectEmpty } from '@util/index';
import { DefaultJsonResponse } from '@util/responses';
import { updatePersonalInfoById } from '@datastore/personalInfo/personalInfoPut';
import { getPersonalInfoCountByPhoneAndNotSameId } from '@datastore/personalInfo/personalInfoGetStore';

// Update provider information
export const updateProviderDetails = async (
  id: string,
  siteId: string,
  providerRecord: Record<string, any>,
  personalInfoRecord: Record<string, any>
) => {
  const providerRepository = providerRepo();
  let phoneCount = 0,
    staffIdCount = 0,
    usernameCount = 0;
  let updatedPersonalInfo = null,
    updatedProvider = null;

  const personalInfo = await providerRepository
    .createQueryBuilder('provider')
    .where('provider.id = :id', { id })
    .select(['provider.personalInfoId'])
    .getOne();

  if (!isObjectEmpty(providerRecord)) {
    if (providerRecord?.username)
      usernameCount = await providerRepository
        .createQueryBuilder('provider')
        .where('LOWER(provider.username) LIKE :username and provider != :id', {
          username: providerRecord?.username?.toLowerCase(),
          id,
        })
        .getCount();

    if (providerRecord?.staff_id)
      staffIdCount = await providerRepository
        .createQueryBuilder('provider')
        .where(
          'LOWER(provider.staff_id) LIKE :staffId and provider.siteId = :siteId and provider.id != :id',
          {
            staffId: providerRecord?.staff_id?.toLowerCase(),
            siteId,
            id,
          }
        )
        .getCount();

    if (usernameCount >= 1)
      return DefaultJsonResponse(
        'A user with the same username already exists.',
        null,
        false
      );

    if (staffIdCount >= 1)
      return DefaultJsonResponse(
        'A user with the same staff ID already exists on the site.',
        null,
        false
      );

    updatedProvider = await providerRepository
      .createQueryBuilder('provider')
      .update()
      .set(providerRecord)
      .where('provider.id = :id', { id })
      .execute();
  }

  if (!isObjectEmpty(personalInfoRecord)) {
    if (personalInfoRecord?.phone) {
      phoneCount = await getPersonalInfoCountByPhoneAndNotSameId(
        personalInfoRecord?.phone,
        <string>personalInfo?.personalInfoId
      );
    }

    if (phoneCount >= 1)
      return DefaultJsonResponse(
        'A user with the same phone number already exists.',
        null,
        false
      );

    updatedPersonalInfo = await updatePersonalInfoById(
      <string>personalInfo?.personalInfoId,
      personalInfoRecord
    );
  }

  return DefaultJsonResponse(
    updatedProvider && updatedPersonalInfo
      ? 'Provider Data Updated Successfully'
      : 'Something Went Wrong',
    null,
    !!(updatedProvider && updatedPersonalInfo)
  );
};
