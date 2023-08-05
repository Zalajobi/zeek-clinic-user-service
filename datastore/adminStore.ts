import { ProfileInfoModelProps } from '../types';
import { adminRepo } from '../typeorm/repositories/adminRepository';
import {
  createNewPersonalInfo,
  getPersonalInfoCountByPhone,
} from './personalInfoStore';
import { Admin } from '../typeorm/entity/admin';
import email from '../lib/email';
import {
  generateTemporaryPassCode,
  generatePasswordHash,
} from '../helpers/utils';
import { customPromiseRequest } from '../lib/api';
import { DefaultJsonResponse } from '../util/responses';
import { AdminModelProps } from '../typeorm/objectsTypes/adminObjectTypes';

export const createNewAdmin = async (
  adminData: AdminModelProps,
  profileInfoData: ProfileInfoModelProps
) => {
  const adminRepository = adminRepo();

  const [infoCountByPhone, adminCount, staffIdAndCount]: any =
    await customPromiseRequest([
      getPersonalInfoCountByPhone(profileInfoData?.phone ?? ''),

      adminRepository
        .createQueryBuilder('admin')
        .where('LOWER(admin.email) LIKE :email', {
          email: adminData.email,
        })
        .orWhere('LOWER(admin.username) LIKE :username', {
          username: adminData.username,
        })
        .getCount(),

      adminRepository
        .createQueryBuilder('admin')
        .where('LOWER(admin.staff_id) = :staffId AND admin.siteId = :siteId', {
          staffId: adminData.staff_id,
          siteId: adminData.siteId,
        })
        .getCount(),
    ]);

  adminData.staff_id = adminData.staff_id.toLowerCase();

  if (
    infoCountByPhone.status.toString() === 'fulfilled' &&
    adminCount.status.toString() === 'fulfilled' &&
    staffIdAndCount.status.toString() === 'fulfilled'
  ) {
    if (Number(staffIdAndCount?.value.toString()) >= 1) {
      return DefaultJsonResponse(
        'Admin With Staff ID already exists',
        null,
        false
      );
    } else if (Number(infoCountByPhone?.value.toString()) >= 1) {
      return DefaultJsonResponse('User with phone already exists', null, false);
    } else if (Number(adminCount?.value.toString()) >= 1) {
      return DefaultJsonResponse(
        'Admin with Username or Email already exits',
        null,
        false
      );
    }
  }

  const admin = await adminRepository.save(new Admin(adminData));
  if (admin) {
    profileInfoData.adminId = admin.id ?? '';
    await createNewPersonalInfo(profileInfoData);

    return DefaultJsonResponse(
      admin
        ? 'Admin Creation Successful'
        : 'Something happened. Error happened while creating Admin',
      admin,
      admin ? true : false
    );
  }

  return DefaultJsonResponse('Something Went Wrong', null, false);
};

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

export const updateAdminData = async (id: string, data: AdminModelProps) => {
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

export const getAdminHeaderBaseTemplateData = async (id: string) => {
  const adminRepository = adminRepo();

  return await adminRepository
    .createQueryBuilder('admin')
    .where('admin.id = :id', {
      id,
    })
    .leftJoinAndSelect('admin.personalInfo', 'profile')
    .select(['admin.role', 'profile.first_name', 'profile.last_name'])
    .getOne();
};
