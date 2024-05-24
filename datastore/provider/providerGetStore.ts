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
    .andWhere('provider.createdAt > :fromDate', {
      fromDate,
    })
    .andWhere('provider.createdAt < :toDate', {
      toDate,
    })
    // .leftJoinAndSelect('provider.personalInfo', 'profile')
    .leftJoinAndSelect('provider.department', 'department')
    .leftJoinAndSelect('provider.unit', 'unit')
    .leftJoinAndSelect('provider.servicearea', 'servicearea')
    .leftJoinAndSelect('provider.primary_role', 'role')
    .select([
      'provider.id',
      'provider.email',
      'provider.status',
      'provider.createdAt',
      'provider.siteId',
      // 'profile.first_name',
      // 'profile.last_name',
      // 'profile.id',
      // 'profile.phone',
      // 'profile.title',
      // 'profile.gender',
      // 'profile.country',
      // 'profile.profile_pic',
      // 'profile.middle_name',
      'department.id',
      'department.name',
      'unit.id',
      'unit.name',
      'servicearea.id',
      'servicearea.name',
      'role.id',
      'role.name',
    ]);

  // if (query) {
  //   providerQuery.where(
  //     'LOWER(profile.first_name) LIKE :name OR LOWER(profile.middle_name) LIKE :name OR LOWER(profile.last_name) LIKE :name OR LOWER(provider.email) LIKE :email',
  //     {
  //       name: `%${query.toLowerCase()}%`,
  //       email: `%${query.toLowerCase()}%`,
  //     }
  //   );
  // }

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

  const provider = await providerRepository.findOne({
    where: { id },
    select: {
      id: true,
      email: true,
      status: true,
      siteId: true,
      primaryRoleId: true,
      departmentId: true,
      serviceAreaId: true,
      unitId: true,
      firstName: true,
      middleName: true,
      lastName: true,
      phone: true,
      dob: true,
      title: true,
      gender: true,
      profilePic: true,
      country: true,
      countryCode: true,
      state: true,
      city: true,
      zipCode: true,
      address: true,
      alternateAddress: true,
      createdAt: true,
    },
  });

  return DefaultJsonResponse(
    provider ? 'Provider Data Retrieval Success' : 'Provider not found',
    provider,
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

  const providerQuery = providerRepository
    .createQueryBuilder('provider')
    .orderBy(
      `provider.${requestBody.sortModel.colId}`,
      requestBody.sortModel.sort === 'asc' ? 'ASC' : 'DESC'
    )
    .innerJoin('provider.primaryRole', 'role')
    .innerJoin('provider.unit', 'unit')
    .innerJoin('provider.department', 'department')
    .innerJoin('provider.serviceArea', 'servicearea')
    .select([
      'provider.id AS id',
      'provider.siteId AS siteId',
      'provider.primaryRoleId AS primaryRoleId',
      'provider.departmentId AS departmentId',
      'provider.serviceAreaId AS serviceAreaId',
      'provider.unitId AS unitId',
      'provider.appointments AS appointments',
      'provider.status AS status',
      'provider.staffId AS staffId',
      'provider.phone AS phone',
      'provider.firstName AS firstName',
      'provider.lastName AS lastName',
      'provider.middleName AS middleName',
      'provider.title AS title',
      'provider.gender AS gender',
      'provider.dob AS dob',
      'provider.address AS address',
      'provider.city AS city',
      'provider.state AS state',
      'provider.country AS country',
      'provider.countryCode AS countryCode',
      'provider.zipCode AS zipCode',
      'provider.religion AS religion',
      'provider.maritalStatus AS maritalStatus',
      'provider.profilePic AS profilePic',
      'provider.isConsultant AS isConsultant',
      'provider.isSpecialist AS isSpecialist',
      'provider.email AS email',
      'role.name AS role',
      'department.name AS dept',
      'servicearea.name AS area',
      'unit.name AS unit',
      'provider.createdAt AS createdAt',
    ]);

  if (requestBody.search && requestBody.searchKey)
    providerQuery.andWhere(
      `LOWER(provider.${requestBody.searchKey}) LIKE :search`,
      {
        search: `%${requestBody.search.toLowerCase()}%`,
      }
    );

  if (requestBody.id)
    providerQuery.where('provider.id = :id', {
      id: requestBody.id,
    });

  if (requestBody.siteId)
    providerQuery.where('provider.siteId = :siteId', {
      siteId: requestBody.siteId,
    });

  if (requestBody.primaryRoleId)
    providerQuery.where('provider.primaryRoleId = :primaryRoleId', {
      primaryRoleId: requestBody.primaryRoleId,
    });

  if (requestBody.departmentId)
    providerQuery.where('provider.departmentId = :departmentId', {
      departmentId: requestBody.departmentId,
    });

  if (requestBody.serviceAreaId)
    providerQuery.where('provider.serviceAreaId = :serviceAreaId', {
      serviceAreaId: requestBody.serviceAreaId,
    });

  if (requestBody.unitId)
    providerQuery.where('provider.unitId = :unitId', {
      unitId: requestBody.unitId,
    });

  if (requestBody.appointments)
    providerQuery.where('provider.appointments = :appointments', {
      appointments: requestBody.appointments,
    });

  if (requestBody.staffId)
    providerQuery.andWhere('LOWER(provider.staffId) LIKE :staffId', {
      staffId: `%${requestBody.staffId.toLowerCase()}%`,
    });

  if (requestBody.phone)
    providerQuery.andWhere('LOWER(provider.phone) LIKE :phone', {
      phone: `%${requestBody.phone.toLowerCase()}%`,
    });

  if (requestBody.firstName)
    providerQuery.andWhere('LOWER(provider.firstName) LIKE :firstName', {
      firstName: `%${requestBody.firstName.toLowerCase()}%`,
    });

  if (requestBody.lastName)
    providerQuery.andWhere('LOWER(provider.lastName) LIKE :lastName', {
      lastName: `%${requestBody.lastName.toLowerCase()}%`,
    });

  if (requestBody.middleName)
    providerQuery.andWhere('LOWER(provider.middleName) LIKE :middleName', {
      middleName: `%${requestBody.middleName.toLowerCase()}%`,
    });

  if (requestBody.title)
    providerQuery.andWhere('LOWER(provider.title) = :title', {
      title: requestBody.title.toLowerCase(),
    });

  if (requestBody.gender)
    providerQuery.andWhere('LOWER(provider.gender) = :gender', {
      gender: requestBody.gender,
    });

  if (requestBody.address)
    providerQuery.andWhere('LOWER(provider.address) LIKE :address', {
      address: `%${requestBody.address.toLowerCase()}%`,
    });

  if (requestBody.alternateAddress)
    providerQuery.andWhere(
      'LOWER(provider.alternateAddress) LIKE :alternateAddress',
      {
        alternateAddress: `%${requestBody.alternateAddress.toLowerCase()}%`,
      }
    );

  if (requestBody.city)
    providerQuery.andWhere('LOWER(provider.city) LIKE :city', {
      city: `%${requestBody.city.toLowerCase()}%`,
    });

  if (requestBody.state)
    providerQuery.andWhere('LOWER(provider.state) LIKE :state', {
      state: `%${requestBody.state.toLowerCase()}%`,
    });

  if (requestBody.country)
    providerQuery.andWhere('LOWER(provider.country) LIKE :country', {
      country: `%${requestBody.country.toLowerCase()}%`,
    });

  if (requestBody.countryCode)
    providerQuery.andWhere('LOWER(provider.countryCode) LIKE :countryCode', {
      countryCode: `%${requestBody.countryCode.toLowerCase()}%`,
    });

  if (requestBody.zipCode)
    providerQuery.andWhere('LOWER(provider.zipCode) LIKE :zipCode', {
      zipCode: `%${requestBody.zipCode.toLowerCase()}%`,
    });

  if (requestBody.religion)
    providerQuery.andWhere('LOWER(provider.religion) LIKE :religion', {
      religion: `%${requestBody.religion.toLowerCase()}%`,
    });

  if (requestBody.maritalStatus)
    providerQuery.where('provider.maritalStatus = :maritalStatus', {
      maritalStatus: requestBody.maritalStatus,
    });

  if (requestBody.profilePic)
    providerQuery.andWhere('LOWER(provider.profilePic) LIKE :profilePic', {
      profilePic: `%${requestBody.profilePic.toLowerCase()}%`,
    });

  if (requestBody.isSpecialist)
    providerQuery.where('provider.isSpecialist = :isSpecialist', {
      isSpecialist: requestBody.isSpecialist,
    });

  if (requestBody.isConsultant)
    providerQuery.where('provider.isConsultant = :isConsultant', {
      isConsultant: requestBody.isConsultant,
    });

  if (requestBody.email)
    providerQuery.where('LOWER(provider.email) LIKE :email', {
      email: `%${requestBody.email.toLowerCase()}%`,
    });

  if (requestBody.appointments)
    providerQuery.where('provider.appointments = :appointments', {
      appointments: requestBody.appointments,
    });

  if (requestBody.status)
    providerQuery.where('provider.status = :status', {
      status: requestBody.status,
    });

  if (requestBody?.range && requestBody.range.from) {
    providerQuery.andWhere('provider.createdAt > :fromDate', {
      fromDate: requestBody.range.from,
    });
  }

  if (requestBody?.range && requestBody.range.to) {
    providerQuery.andWhere('provider.createdAt < :toDate', {
      toDate: requestBody.range.to,
    });
  }

  const providerData = await providerQuery
    .skip(perPage * page)
    .take(perPage)
    .getRawMany();

  return DefaultJsonResponse(
    providerData?.length >= 1
      ? 'Provider Data Retrieval Success'
      : 'No Provider Found',
    providerData,
    !!providerData
  );
};
