// @ts-ignore
import { providerRepo } from '@typeorm/repositories/providerRepository';
import { ProfileInfoModelProps } from '../types';
import { Provider } from '@typeorm/entity/providers';
import {
  createNewPersonalInfo,
  getPersonalInfoCountByPhone,
} from '@datastore/personalInfoStore';
import { DefaultJsonResponse } from '@util/responses';
import { customPromiseRequest } from '@lib/api';
import { ProviderModelProps } from '@typeorm/objectsTypes/providersObjectTypes';
import { hospitalRepo } from '@typeorm/repositories/hospitalRepository';
import { HospitalStatus } from '@typeorm/entity/enums';

// Post Requests Stores
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

// Get Providers Data - Pagination
export const adminGetProvidersInfoPagination = async (
  page: number,
  perPage: number,
  query: string,
  from: string,
  to: string,
  country: string,
  status: string,
  siteId: string
) => {
  const providerRepository = providerRepo();

  let skip = Number(perPage * page),
    take = Number(perPage),
    providers = null;
  const fromDate = from ? new Date(from) : new Date('1900-01-01'),
    toDate = to ? new Date(to) : new Date(),
    hospitalRepository = hospitalRepo();

  const providerQuery = providerRepository
    .createQueryBuilder('provider')
    .where('provider.siteId = :siteId', { siteId })
    .andWhere('provider.created_at > :fromDate', {
      fromDate,
    })
    .andWhere('provider.created_at < :toDate', {
      toDate,
    })
    .leftJoinAndSelect('provider.personalInfo', 'profile')
    .leftJoinAndSelect('provider.department', 'department')
    .leftJoinAndSelect('provider.unit', 'unit')
    .leftJoinAndSelect('provider.servicearea', 'servicearea')
    .leftJoinAndSelect('provider.primary_role', 'role')
    .select([
      'provider.id',
      'provider.email',
      'provider.status',
      'provider.created_at',
      'provider.siteId',
      'profile.first_name',
      'profile.last_name',
      'profile.id',
      'profile.phone',
      'profile.title',
      'profile.gender',
      'profile.country',
      'profile.profile_pic',
      'profile.middle_name',
      'department.id',
      'department.name',
      'unit.id',
      'unit.name',
      'servicearea.id',
      'servicearea.name',
      'role.id',
      'role.name',
    ]);

  if (query) {
    providerQuery.where(
      'LOWER(profile.first_name) LIKE :name OR LOWER(profile.middle_name) LIKE :name OR LOWER(profile.last_name) LIKE :name OR LOWER(provider.email) LIKE :email',
      {
        name: `%${query.toLowerCase()}%`,
        email: `%${query.toLowerCase()}%`,
      }
    );
  }

  if (country) {
    providerQuery.andWhere('LOWER(provider.country) LIKE :country', {
      country: `%${country.toLowerCase()}%`,
    });
  }

  if (status) {
    providerQuery.andWhere('provider.status = :status', {
      status: status as HospitalStatus,
    });
  }

  if (Number(perPage) === 0) {
    providers = await providerQuery.getManyAndCount();
  } else {
    providers = await providerQuery.skip(skip).take(take).getManyAndCount();
  }

  return DefaultJsonResponse(
    'Provider Data Retrieval Success',
    providers,
    true
  );
};

// export const selectAllProviderCountriesBySiteId = async (siteId:string) => {
//   const providerRepository = providerRepo();
//
//   console.log(`HELLO WORLD`)
//
//   const countries = await providerRepository
//     .createQueryBuilder('provider')
//     .where('provider.siteId = :siteId', { siteId })
//     .leftJoinAndSelect('provider.personalInfo', 'profile')
//     .select('profile.country')
//     .orderBy({
//       'profile.country': 'ASC'
//     })
//     .getRawMany()
//
//   console.log(countries)
//
//   return DefaultJsonResponse(
//     'Provider Countries Data Retrieval Success',
//     countries,
//     true
//   );
// }
export class selectAllProviderCountriesBySiteId {}
