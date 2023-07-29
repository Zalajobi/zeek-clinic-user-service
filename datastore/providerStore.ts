import { providerRepo } from '../typeorm/repositories/providerRepository';
import {
  createProviderRequestBody,
  profileInfoModelProps,
  ProviderModelProps,
} from '../types';
import { Admin } from '../typeorm/entity/admin';
import { Provider } from '../typeorm/entity/providers';
import {
  createNewPersonalInfo,
  getPersonalInfoCountByPhone,
} from './personalInfoStore';
import { DefaultJsonResponse } from '../util/responses';

export const adminCreateNewProvider = async (
  data: ProviderModelProps,
  personalInfoData: profileInfoModelProps,
  phone: string
) => {
  const providerRepository = providerRepo();

  const isUnique = await Promise.all([
    getPersonalInfoCountByPhone(phone),

    providerRepository
      .createQueryBuilder('provider')
      .where('LOWER(provider.email) LIKE :email', {
        email: data.email,
      })
      .orWhere('LOWER(provider.username) LIKE :username', {
        username: data.username,
      })
      .select(['provider.email', 'provider.username'])
      .getOne(),

    providerRepository
      .createQueryBuilder('provider')
      .where('LOWER(provider.staff_id) LIKE :staffId', {
        staffId: data.staff_id,
      })
      .getCount(),
  ]);

  if (isUnique[0] >= 1 || isUnique[1] || isUnique[2] >= 1) {
    if (isUnique[2] >= 1)
      return DefaultJsonResponse(
        'Provider With Staff ID already exists',
        null,
        false
      );
    else
      return DefaultJsonResponse(
        'Provider with Username, Email or Phone already exist...',
        null,
        false
      );
  }

  const newProvider = await providerRepository.save(new Provider(data));

  if (newProvider) {
    personalInfoData.providerId = newProvider?.id ?? '';
    await createNewPersonalInfo(personalInfoData);

    return DefaultJsonResponse('New Provider Added', newProvider, true);
  }

  return DefaultJsonResponse('Something Went Wrong', null, false);
};
