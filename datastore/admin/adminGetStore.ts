import { adminRepo } from '@typeorm/repositories/adminRepository';
import { Admin } from '@typeorm/entity/admin';
import { ObjectLiteral } from 'typeorm';
import { DefaultJsonResponse } from '@util/responses';
import { searchAdminRequestSchema } from '@lib/schemas/adminSchemas';
import { z } from 'zod';
import { extractPerPageAndPage } from '@util/index';

export const getAdminPrimaryLoginInformation = async (value: string) => {
  const adminRepository = adminRepo();

  const adminData = adminRepository
    .createQueryBuilder('admin')
    .where('LOWER(admin.email) = :email OR LOWER(admin.staffId) = :staffId', {
      email: value,
      staffId: value,
    })
    .select([
      'admin.id',
      'admin.siteId',
      'admin.email',
      'admin.password',
      'admin.role',
    ])
    .getOne();

  if (!adminData) throw new Error('Incorrect Credentials');

  return adminData;
};

export const lookupPrimaryAdminInfo = async (
  value: string
): Promise<ObjectLiteral | null> => {
  const adminRepository = adminRepo();

  return await adminRepository
    .createQueryBuilder('admin')
    .where('admin.email = :email', {
      email: value,
    })
    .orWhere('admin.username = :username', {
      username: value,
    })
    .select(['admin.password', 'admin.role', 'admin.email', 'admin.id'])
    .getOne();
};

export const getAdminBaseDataAndProfileDataByAdminId = async (id: string) => {
  const adminRepository = adminRepo();

  return await adminRepository.findOne({
    where: {
      id,
    },
    select: {
      email: true,
      password: true,
      role: true,
      id: true,
      // profile: true,
    },
  });
};

export const getOneAdminDataById = async (
  id: string
): Promise<Admin | null> => {
  const adminRepository = adminRepo();

  return await adminRepository.findOneBy({
    id,
  });
};

export const getAdminAndProfileDataByEmailOrUsername = async (
  value: string
) => {
  const adminRepository = adminRepo();

  return await adminRepository
    .createQueryBuilder('admin')
    .where('admin.email = :email', {
      email: value,
    })
    .orWhere('admin.username = :username', {
      username: value,
    })
    .getOne();
};

export const getAdminDetails = async (id: string) => {
  const adminRepository = adminRepo();

  const adminData = await adminRepository.findOne({
    where: {
      id: id,
    },
    select: {
      id: true,
      role: true,
      siteId: true,
      email: true,
      staffId: true,
      firstName: true,
      lastName: true,
      middleName: true,
      religion: true,
      maritalStatus: true,
      phone: true,
      title: true,
      gender: true,
      dob: true,
      address: true,
      alternateAddress: true,
      city: true,
      country: true,
      countryCode: true,
      zipCode: true,
      profilePic: true,
      createdAt: true,
    },
  });

  if (!adminData) throw new Error('Admin not found');

  return DefaultJsonResponse(
    'Admin data retrieved successfully',
    adminData,
    true
  );
};

export const getAdminCountBySiteId = async (siteId: string) => {
  const adminRepository = adminRepo();

  return await adminRepository.count({
    where: { siteId },
  });
};

export const getSearchAdminData = async (
  requestBody: z.infer<typeof searchAdminRequestSchema>
) => {
  const adminRepository = adminRepo();

  const { page, perPage } = extractPerPageAndPage(
    requestBody.endRow,
    requestBody.startRow
  );

  const baseQuery = adminRepository
    .createQueryBuilder('admin')
    .orderBy(
      `admin.${requestBody.sortModel.colId}`,
      requestBody.sortModel.sort === 'asc' ? 'ASC' : 'DESC'
    )
    .select([
      'admin.siteId',
      'admin.role',
      'admin.email',
      'admin.staffId',
      'admin.title',
      'admin.firstName',
      'admin.lastName',
      'admin.middleName',
      'admin.phone',
      'admin.gender',
      'admin.dob',
      'admin.address',
      'admin.alternateAddress',
      'admin.city',
      'admin.state',
      'admin.country',
      'admin.countryCode',
      'admin.zipCode',
      'admin.profilePic',
      'admin.religion',
      'admin.maritalStatus',
      'admin.id',
      'admin.createdAt',
      'admin.updatedAt',
    ]);

  if (requestBody.search && requestBody.searchKey)
    baseQuery.where(`LOWER(admin.${requestBody.searchKey}) LIKE :search`, {
      search: `%${requestBody.search.toLowerCase()}%`,
    });

  if (requestBody.id)
    baseQuery.andWhere('admin.id = :id', {
      id: requestBody.id,
    });

  if (requestBody.siteId)
    baseQuery.andWhere('admin.siteId = :siteId', {
      siteId: requestBody.siteId,
    });

  if (requestBody.staffId)
    baseQuery.andWhere('LOWER(admin.staffId) LIKE :staffId', {
      staffId: `%${requestBody.staffId.toLowerCase()}%`,
    });

  if (requestBody.role)
    baseQuery.andWhere('admin.role = :role', {
      role: requestBody.role,
    });

  if (requestBody.phone)
    baseQuery.andWhere('LOWER(admin.phone) LIKE :phone', {
      phone: `%${requestBody.phone.toLowerCase()}%`,
    });

  if (requestBody.firstName)
    baseQuery.andWhere('LOWER(admin.firstName) LIKE :firstName', {
      firstName: `%${requestBody.firstName.toLowerCase()}%`,
    });

  if (requestBody.lastName)
    baseQuery.andWhere('LOWER(admin.lastName) LIKE :lastName', {
      lastName: `%${requestBody.lastName.toLowerCase()}%`,
    });

  if (requestBody.middleName)
    baseQuery.andWhere('LOWER(admin.middleName) LIKE :middleName', {
      middleName: `%${requestBody.middleName.toLowerCase()}%`,
    });

  if (requestBody.title)
    baseQuery.andWhere('LOWER(admin.title) = :title', {
      title: requestBody.title.toLowerCase(),
    });

  if (requestBody.gender)
    baseQuery.andWhere('LOWER(admin.gender) = :gender', {
      gender: requestBody.gender,
    });

  if (requestBody.address)
    baseQuery.andWhere('LOWER(admin.address) LIKE :address', {
      address: `%${requestBody.address.toLowerCase()}%`,
    });

  if (requestBody.alternateAddress)
    baseQuery.andWhere('LOWER(admin.alternateAddress) LIKE :alternateAddress', {
      alternateAddress: `%${requestBody.alternateAddress.toLowerCase()}%`,
    });

  if (requestBody.city)
    baseQuery.andWhere('LOWER(admin.city) LIKE :city', {
      city: `%${requestBody.city.toLowerCase()}%`,
    });

  if (requestBody.state)
    baseQuery.andWhere('LOWER(admin.state) LIKE :state', {
      state: `%${requestBody.state.toLowerCase()}%`,
    });

  if (requestBody.country)
    baseQuery.andWhere('LOWER(admin.country) LIKE :country', {
      country: `%${requestBody.country.toLowerCase()}%`,
    });

  if (requestBody.countryCode)
    baseQuery.andWhere('LOWER(admin.countryCode) LIKE :countryCode', {
      countryCode: `%${requestBody.countryCode.toLowerCase()}%`,
    });

  if (requestBody.zipCode)
    baseQuery.andWhere('LOWER(admin.zipCode) LIKE :zipCode', {
      zipCode: `%${requestBody.zipCode.toLowerCase()}%`,
    });

  if (requestBody.religion)
    baseQuery.andWhere('LOWER(admin.religion) LIKE :religion', {
      religion: `%${requestBody.religion.toLowerCase()}%`,
    });

  if (requestBody.maritalStatus)
    baseQuery.andWhere('admin.maritalStatus = :maritalStatus', {
      maritalStatus: requestBody.maritalStatus,
    });

  if (requestBody.profilePic)
    baseQuery.andWhere('LOWER(admin.profilePic) LIKE :profilePic', {
      profilePic: `%${requestBody.profilePic.toLowerCase()}%`,
    });

  if (requestBody.email)
    baseQuery.where('LOWER(admin.email) LIKE :email', {
      email: `%${requestBody.email.toLowerCase()}%`,
    });

  if (requestBody?.range && requestBody.range.from)
    baseQuery.andWhere('admin.createdAt > :fromDate', {
      fromDate: requestBody.range.from,
    });

  if (requestBody?.range && requestBody.range.to)
    baseQuery.andWhere('admin.createdAt < :toDate', {
      toDate: requestBody.range.to,
    });

  const adminData = await baseQuery
    .skip(perPage * page)
    .take(perPage)
    .getManyAndCount();

  return DefaultJsonResponse(
    adminData ? 'Admin Data Retrieval Success' : 'Something Went Wong',
    adminData,
    !!adminData
  );
};
