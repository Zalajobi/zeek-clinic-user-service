import { providerRepo } from '@typeorm/repositories/providerRepository';
import { ProfileInfoModelProps } from '../types';
import { Provider } from '@typeorm/entity/providers';
import {
  createNewPersonalInfo,
  getPersonalInfoCountByPhone,
  getPersonalInfoCountByPhoneAndNotSameId,
  updatePersonalInfoById,
} from '@datastore/personalInfoStore';
import { DefaultJsonResponse } from '@util/responses';
import { customPromiseRequest } from '@lib/api';
import { ProviderModelProps } from '@typeorm/objectsTypes/providersObjectTypes';
import { hospitalRepo } from '@typeorm/repositories/hospitalRepository';
import { HospitalStatus } from '@typeorm/entity/enums';

import { getPatientCountByProviderId } from '@datastore/patientStore';

import { isObjectEmpty } from '@util/index';

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
    toDate = to ? new Date(to) : new Date();

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

export const adminGetProviderDetails = async (id: string) => {
  const providerRepository = providerRepo();

  const [provider, patientCount] = await Promise.all([
    providerRepository
      .createQueryBuilder('provider')
      .where('provider.id = :id', { id })
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
        'profile.dob',
        'profile.title',
        'profile.gender',
        'profile.country',
        'profile.profile_pic',
        'profile.middle_name',
        'profile.state',
        'profile.city',
        'profile.address',
        'department.id',
        'department.name',
        'unit.id',
        'unit.name',
        'servicearea.id',
        'servicearea.name',
        'role.id',
        'role.name',
      ])
      .getOne(),

    getPatientCountByProviderId(id),
  ]);

  return DefaultJsonResponse(
    'Provider Data Retrieval Success',
    {
      provider,
      patientCount,
    },
    true
  );
};
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
