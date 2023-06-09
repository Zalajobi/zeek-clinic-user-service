import { adminModelProps } from '../types';
import { adminRepo } from '../typeorm/repositories/adminRepository';
import {
  createNewPersonalInfo,
  getPersonalInfoByPhone,
} from './personalInfoStore';
import { Admin } from '../typeorm/entity/admin';
import { AdminEntityObject } from '../typeorm/objectsTypes/adminObjectTypes';

export const createNewAdmin = async (data: adminModelProps) => {
  const adminRepository = adminRepo();

  let isNotUnique = await adminRepository
    .createQueryBuilder('admin')
    .where('admin.email = :email', {
      email: data?.email,
    })
    .orWhere('admin.username = :username', {
      username: data?.username,
    })
    .getOne();

  if (
    isNotUnique ||
    (await getPersonalInfoByPhone(data?.profileData?.phone ?? ''))
  )
    return {
      success: false,
      message: 'Admin with same email, phone or username already exists',
    };

  const admin = await adminRepository.save(new Admin(data));
  data.profileData.adminId = admin.id;

  const profileInformation = await createNewPersonalInfo(data.profileData);

  if (admin && profileInformation) {
    await adminRepository.update(
      {
        id: admin.id,
      },
      {
        personalInfoId: profileInformation.id,
      }
    );
  }

  return {
    success: admin && profileInformation ? true : false,
    message:
      admin && profileInformation
        ? 'Admin Creation Successful'
        : 'Something happened. Error happened while creating Admin',
  };
};

export const getAdminPrimaryInformation = async (value: string) => {
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

  return <AdminEntityObject>await adminRepository.findOneBy({
    id,
  });
};

export const updateAdminPasswordByAdminId = async (
  id: string,
  password: string
) => {
  const adminRepository = adminRepo();

  return await adminRepository.update(
    {
      id,
    },
    {
      password,
    }
  );
};

export const updateAdminData = async (id: string, data: AdminEntityObject) => {
  const adminRepository = adminRepo();

  return await adminRepository.update(
    {
      id,
    },
    data
  );
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
