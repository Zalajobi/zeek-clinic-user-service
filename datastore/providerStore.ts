import { providerRepo } from '../typeorm/repositories/providerRepository';
import { ProfileInfoModelProps, ProviderModelProps } from '../types';
import { Provider } from '../typeorm/entity/providers';
import {
  createNewPersonalInfo,
  getPersonalInfoCountByPhone,
} from './personalInfoStore';
import { DefaultJsonResponse } from '../util/responses';
import { customPromiseRequest } from '../lib/api';

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

  const personalInfo = await createNewPersonalInfo(personalInfoData);

  if (personalInfo) {
    const provider = new Provider(data);
    provider.personalInfo = personalInfo;
    const newProvider = await providerRepository.save(provider);

    return DefaultJsonResponse('New Provider Added', newProvider, true);
  }

  return DefaultJsonResponse('Something Went Wrong', null, false);
};
