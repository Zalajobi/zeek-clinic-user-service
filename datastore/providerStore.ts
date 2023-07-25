import { providerRepo } from '../typeorm/repositories/providerRepository';
import { createProviderRequestBody, ProviderModelProps } from '../types';
import { Admin } from '../typeorm/entity/admin';
import { Provider } from '../typeorm/entity/providers';
import {
  createNewPersonalInfo,
  getPersonalInfoCountByPhone,
} from './personalInfoStore';
import { DefaultJsonResponse } from '../util/responses';

export const adminCreateNewProvider = async (
  data: ProviderModelProps,
  personalInfoData: createNewPersonalInfo,
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
      .where('provider.siteId = :siteId', {
        siteId: data.siteId,
      })
      .getCount(),
  ]);

  if (isUnique[0] == 0 || !isUnique[1] || isUnique[2] == 0) {
    if (isUnique[2])
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

  const admin = await providerRepository.save(new Provider(data));

  if (admin) return DefaultJsonResponse('New Provider Added', admin, true);

  return DefaultJsonResponse('Something Went Wrong', null, false);
};
