import { AdminModelProps } from '@typeorm/objectsTypes/adminObjectTypes';
import { adminRepo } from '@typeorm/repositories/adminRepository';
import { customPromiseRequest } from '@lib/api';
import {
  createNewPersonalInfo,
  getPersonalInfoCountByPhone,
} from '@datastore/personalInfoStore';
import { AdminRoles } from '@typeorm/entity/enums';
import { DefaultJsonResponse } from '@util/responses';
import { Admin } from '@typeorm/entity/admin';
import { ProfileInfoModelProps } from '@typeDesc/index';

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
  adminData.role = adminData.role.replace(' ', '_') as AdminRoles;

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

  const personalInfo = await createNewPersonalInfo(profileInfoData);
  const newAdmin = new Admin(adminData);
  newAdmin.personalInfo = personalInfo;

  const admin = await adminRepository.save(newAdmin);

  if (admin) {
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
