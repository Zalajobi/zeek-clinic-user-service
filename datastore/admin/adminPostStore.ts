import { adminRepo } from '@typeorm/repositories/adminRepository';
import { customPromiseRequest } from '@lib/api';
import { AdminRoles } from '@typeorm/entity/enums';
import { DefaultJsonResponse } from '@util/responses';
import { Admin } from '@typeorm/entity/admin';
import { z } from 'zod';
import { createAdminRequestSchema } from '@lib/schemas/adminSchemas';

export const createNewAdmin = async (
  adminData: z.infer<typeof createAdminRequestSchema>
) => {
  const adminRepository = adminRepo();

  const [adminCount, staffIdAndCount]: any = await customPromiseRequest([
    adminRepository
      .createQueryBuilder('admin')
      .where('LOWER(admin.email) = :email', {
        email: adminData.email.toLowerCase(),
      })
      .andWhere('admin.siteId = :siteId', {
        siteId: adminData.siteId,
      })
      .getCount(),

    adminRepository
      .createQueryBuilder('admin')
      .where('LOWER(admin.staff_id) = :staffId AND admin.siteId = :siteId', {
        staffId: adminData.staffId,
        siteId: adminData.siteId,
      })
      .getCount(),
  ]);

  adminData.staffId = adminData.staffId.toLowerCase();
  adminData.role = adminData.role.replace(' ', '_') as AdminRoles;

  if (
    adminCount.status.toString() === 'fulfilled' &&
    staffIdAndCount.status.toString() === 'fulfilled'
  ) {
    if (Number(staffIdAndCount?.value.toString()) >= 1) {
      return DefaultJsonResponse(
        'Admin With Staff ID already exists',
        null,
        false
      );
    } else if (Number(adminCount?.value.toString()) >= 1) {
      return DefaultJsonResponse(
        'Admin with Username or Email already exits',
        null,
        false
      );
    }
  }

  const newAdmin = new Admin(adminData);

  const admin = await adminRepository.save(newAdmin);

  if (admin) {
    return DefaultJsonResponse(
      admin
        ? 'Admin Creation Successful'
        : 'Something happened. Error happened while creating Admin',
      admin,
      !!admin
    );
  }

  return DefaultJsonResponse('Something Went Wrong', null, false);
};
