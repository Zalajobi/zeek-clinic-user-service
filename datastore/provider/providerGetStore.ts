// Get Providers Data - Pagination
import { HospitalStatus } from '@typeorm/entity/enums';
import { providerRepo } from '@typeorm/repositories/providerRepository';
import { DefaultJsonResponse } from '@util/responses';
import { getPatientCountByProviderId } from '@datastore/patient/patientGetStore';

// Get Providers Pagination Data
export const fetchFilteredProviderData = async (
  page: number,
  perPage: number,
  query: string | undefined,
  from: string | undefined,
  to: string | undefined,
  country: string | undefined,
  status: string | undefined,
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

// Admin Get Provider Details
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

// Get Provider Count by SiteId
export const getProviderCountBySiteId = async (siteId: string) => {
  const providerRepository = providerRepo();

  return await providerRepository.count({
    where: { siteId },
  });
};
