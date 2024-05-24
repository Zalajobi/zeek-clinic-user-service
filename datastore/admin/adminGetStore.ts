import { adminRepo } from '@typeorm/repositories/adminRepository';
import { Admin } from '@typeorm/entity/admin';
import { ObjectLiteral } from 'typeorm';
import { DefaultJsonResponse } from '@util/responses';

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
      city: true,
      country: true,
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
