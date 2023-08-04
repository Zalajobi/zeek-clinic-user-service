import { providerRepo } from '../typeorm/repositories/providerRepository';
import {
  createProviderRequestBody,
  ProfileInfoModelProps,
  ProviderModelProps,
} from '../types';
import { Admin } from '../typeorm/entity/admin';
import { Provider } from '../typeorm/entity/providers';
import {
  createNewPersonalInfo,
  getPersonalInfoCountByPhone,
} from './personalInfoStore';
import { DefaultJsonResponse } from '../util/responses';
import { customPromiseRequest } from '../lib/api';

type CreateProviderUniquePromise = [
  { status: string; value: number },

  {
    status: string;
    value: number;
  },

  {
    status: string;
    value: number;
  }
];

export const adminCreateNewProvider = async (
  data: ProviderModelProps,
  personalInfoData: ProfileInfoModelProps,
  phone: string
) => {
  const providerRepository = providerRepo();

  const [infoCountByPhone, providerCount, staffIdAndCount]: any =
    await customPromiseRequest([
      getPersonalInfoCountByPhone(phone),

      providerRepository
        .createQueryBuilder('provider')
        .where('LOWER(provider.email) LIKE :email', {
          email: data.email,
        })
        .orWhere('LOWER(provider.username) LIKE :username', {
          username: data.username,
        })
        .getCount(),

      providerRepository
        .createQueryBuilder('provider')
        .where(
          'LOWER(provider.staff_id) = :staffId AND provider.siteId = :siteId',
          {
            staffId: data.staff_id,
            siteId: data.siteId,
          }
        )
        .getCount(),
    ]);

  console.log(infoCountByPhone);
  console.log(providerCount);
  console.log(staffIdAndCount);

  if (
    infoCountByPhone.status.toString() === 'fulfilled' &&
    providerCount.status.toString() === 'fulfilled' &&
    staffIdAndCount.status.toString() === 'fulfilled'
  ) {
    if (Number(staffIdAndCount?.value.toString()) >= 1) {
      return DefaultJsonResponse(
        'Provider With Staff ID already exists',
        null,
        false
      );
    } else if (Number(infoCountByPhone?.value.toString()) >= 1) {
      return DefaultJsonResponse('User with phone already exists', null, false);
    } else if (Number(providerCount?.value.toString()) >= 1) {
      return DefaultJsonResponse(
        'Provider with Username or Email already exits',
        null,
        false
      );
    }
  }

  const newProvider = await providerRepository.save(new Provider(data));

  if (newProvider) {
    personalInfoData.providerId = newProvider?.id ?? '';
    await createNewPersonalInfo(personalInfoData);

    return DefaultJsonResponse('New Provider Added', newProvider, true);
  }

  return DefaultJsonResponse('Something Went Wrong', null, false);
};
