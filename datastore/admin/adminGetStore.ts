import { adminRepo } from '@typeorm/repositories/adminRepository';
import { Admin } from '@typeorm/entity/admin';
import { ObjectLiteral } from 'typeorm';

export const getAdminPrimaryLoginInformation = async (
  value: string
): Promise<Admin | null> => {
  const adminRepository = adminRepo();

  return await adminRepository
    .createQueryBuilder('admin')
    .where('admin.email = :email OR admin.username = :username', {
      email: value,
      username: value,
    })
    .select([
      'admin.password',
      'admin.role',
      'admin.email',
      'admin.id',
      'admin.siteId',
    ])
    .getOne();
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

export const getAdminFullProfileData = async (id: string) => {
  const adminRepository = adminRepo();

  return await adminRepository
    .createQueryBuilder('admin')
    .where('admin.id = :id', {
      id,
    })
    .select([
      'admin.role',
      'admin.siteId',
      'admin.email',
      'admin.username',
      'admin.createdAt',
      'admin.staff_id',
      'admin.id',
      'admin.staff_id',
      // 'profile.first_name',
      // 'profile.last_name',
      // 'profile.phone',
      // 'profile.title',
      // 'profile.gender',
      // 'profile.dob',
      // 'profile.address',
      // 'profile.city',
      // 'profile.country',
      // 'profile.zipCode',
      // 'profile.profile_pic',
      // 'profile.createdAt',
      // 'profile.middle_name',
      // 'profile.religion',
      // 'profile.marital_status',
      // 'profile.id',
    ])
    .getOne();
};

export const getAdminDetails = async (id: string): Promise<Admin | null> => {
  const adminRepository = adminRepo();

  return await adminRepository.findOne({
    where: {
      id,
    },
    select: {
      siteId: true,
      role: true,
      email: true,
      username: true,
      staff_id: true,
      id: true,
      createdAt: true,
    },
  });
};
