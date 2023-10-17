import { adminRepo } from '@typeorm/repositories/adminRepository';
import { AdminModelProps } from '@typeorm/objectsTypes/adminObjectTypes';

export const getAdminPrimaryLoginInformation = async (value: string) => {
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

export const getAdminPrimaryInformationAndProfile = async (value: string) => {
  const adminRepository = adminRepo();

  return await adminRepository
    .createQueryBuilder('admin')
    .where('admin.email = :email', {
      email: value,
    })
    .orWhere('admin.username = :username', {
      username: value,
    })
    .leftJoinAndSelect('admin.personalInfo', 'profile')
    .select([
      'admin.password',
      'admin.role',
      'admin.email',
      'admin.id',
      'profile.first_name',
    ])
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
    relations: {
      personalInfo: true,
    },
  });
};

export const getOneAdminDataById = async (id: string) => {
  const adminRepository = adminRepo();

  return <AdminModelProps>await adminRepository.findOneBy({
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
    .leftJoinAndSelect('admin.personalInfo', 'profile')
    .getOne();
};

export const getAdminHeaderBaseTemplateData = async (id: string) => {
  const adminRepository = adminRepo();

  return await adminRepository
    .createQueryBuilder('admin')
    .where('admin.id = :id', {
      id,
    })
    .leftJoinAndSelect('admin.personalInfo', 'profile')
    .select([
      'admin.role',
      'admin.siteId',
      'admin.email',
      'admin.id',
      'admin.staff_id',
      'profile.first_name',
      'profile.last_name',
      'profile.phone',
      'profile.title',
      'profile.gender',
      'profile.dob',
      'profile.address',
      'profile.city',
      'profile.country',
      'profile.zip_code',
      'profile.profile_pic',
      'profile.created_at',
      'profile.middle_name',
      'profile.religion',
      'profile.marital_status',
    ])
    .getOne();
};