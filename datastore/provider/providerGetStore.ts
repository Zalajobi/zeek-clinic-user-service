// Get Providers Data - Pagination
import { HospitalStatus } from '@typeorm/entity/enums';
import { providerRepo } from '@typeorm/repositories/providerRepository';
import { DefaultJsonResponse } from '@util/responses';
import { getPatientCountByProviderId } from '@datastore/patient/patientGetStore';
import { z } from 'zod';
import { searchProviderRequestSchema } from '@lib/schemas/providerSchemas';
import { extractPerPageAndPage } from '@util/index';

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

// Search Service Area
export const getSearchProviderData = async (
  requestBody: z.infer<typeof searchProviderRequestSchema>
) => {
  const providerRepository = providerRepo();

  const { page, perPage } = extractPerPageAndPage(
    requestBody.endRow,
    requestBody.startRow
  );

  const serviceAreaQuery = providerRepository
    .createQueryBuilder('provider')
    .orderBy({
      [`provider.${requestBody.sortModel.colId}`]:
        requestBody.sortModel.sort === 'asc' ? 'ASC' : 'DESC',
    })
    .innerJoin('provider.primary_role', 'role')
    .innerJoin('provider.personalInfo', 'profile')
    .innerJoin('provider.unit', 'unit')
    .innerJoin('provider.department', 'department')
    .innerJoin('provider.servicearea', 'servicearea')
    .select([
      'provider.id AS id',
      'provider.siteId AS site_id',
      'provider.primaryRoleId AS role_id',
      'provider.personalInfoId AS profile_id',
      'provider.departmentId AS dept_id',
      'provider.serviceareaId AS area_id',
      'provider.unitId AS unit_id',
      'provider.email AS email',
      'provider.staff_id AS staff_id',
      'provider.is_consultant AS is_consultant',
      'provider.is_specialist AS is_specialist',
      'provider.appointments AS appointments',
      'provider.status AS status',
      'provider.created_at AS created_at',
      'role.name AS role',
      'department.name AS dept',
      'servicearea.name AS area',
      'unit.name AS unit',
      'profile.phone AS phone',
      'profile.first_name AS first_name',
      'profile.last_name AS last_name',
      'profile.middle_name AS middle_name',
      'profile.title AS title',
      'profile.gender AS gender',
      'profile.dob AS dob',
      'profile.address AS address',
      'profile.address_two AS address_two',
      'profile.city AS city',
      'profile.state AS state',
      'profile.country AS country',
      'profile.religion AS religion',
      'profile.marital_status AS marital_status',
      'profile.zip_code AS zip_code',
      'profile.profile_pic AS profile_pic',
    ]);

  if (requestBody.siteId) {
    serviceAreaQuery.where('provider.siteId = :siteId', {
      siteId: requestBody.siteId,
    });
  }

  if (requestBody.id) {
    serviceAreaQuery.where('provider.id = :id', {
      id: requestBody.id,
    });
  }

  if (requestBody.primaryRoleId) {
    serviceAreaQuery.where('provider.primaryRoleId = :primaryRoleId', {
      primaryRoleId: requestBody.primaryRoleId,
    });
  }

  if (requestBody.personalInfoId) {
    serviceAreaQuery.where('provider.personalInfoId = :personalInfoId', {
      personalInfoId: requestBody.personalInfoId,
    });
  }

  if (requestBody.departmentId) {
    serviceAreaQuery.where('provider.departmentId = :departmentId', {
      departmentId: requestBody.departmentId,
    });
  }

  if (requestBody.serviceareaId) {
    serviceAreaQuery.where('provider.serviceareaId = :serviceareaId', {
      serviceareaId: requestBody.serviceareaId,
    });
  }

  if (requestBody.unitId) {
    serviceAreaQuery.where('provider.unitId = :unitId', {
      unitId: requestBody.unitId,
    });
  }

  if (requestBody.email) {
    serviceAreaQuery.where('LOWER(provider.email) LIKE :email', {
      email: `%${requestBody.email.toLowerCase()}%`,
    });
  }

  if (requestBody.username) {
    serviceAreaQuery.where('LOWER(provider.username) LIKE :username', {
      username: `%${requestBody.username.toLowerCase()}%`,
    });
  }

  if (requestBody.staff_id) {
    serviceAreaQuery.where('provider.staff_id = :staff_id', {
      staff_id: requestBody.staff_id,
    });
  }

  if (requestBody.is_consultant) {
    serviceAreaQuery.where('provider.is_consultant = :is_consultant', {
      is_consultant: requestBody.is_consultant,
    });
  }

  if (requestBody.is_specialist) {
    serviceAreaQuery.where('provider.is_specialist = :is_specialist', {
      is_specialist: requestBody.is_specialist,
    });
  }

  if (requestBody.appointments) {
    serviceAreaQuery.where('provider.appointments = :appointments', {
      appointments: requestBody.appointments,
    });
  }

  if (requestBody.status) {
    serviceAreaQuery.where('provider.status = :status', {
      status: requestBody.status,
    });
  }

  if (requestBody?.range && requestBody.range.from) {
    serviceAreaQuery.andWhere('provider.created_at > :fromDate', {
      fromDate: requestBody.range.from,
    });
  }

  if (requestBody?.range && requestBody.range.to) {
    serviceAreaQuery.andWhere('provider.created_at < :toDate', {
      toDate: requestBody.range.to,
    });
  }

  if (requestBody.search && requestBody.searchKey) {
    serviceAreaQuery.andWhere(
      `LOWER(provider.${requestBody.searchKey}) LIKE :search`,
      {
        search: `%${requestBody.search.toLowerCase()}%`,
      }
    );
  }

  return await serviceAreaQuery
    .skip(perPage * page)
    .take(perPage)
    .getRawMany();
};
