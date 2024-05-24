import { adminRepo } from '@typeorm/repositories/adminRepository';
import { AdminRoles } from '@typeorm/entity/enums';
import { DefaultJsonResponse } from '@util/responses';
import { Admin } from '@typeorm/entity/admin';
import { z } from 'zod';
import { createAdminRequestSchema } from '@lib/schemas/adminSchemas';

export const createNewAdmin = async (
  adminData: z.infer<typeof createAdminRequestSchema>
) => {
  const adminRepository = adminRepo();

  const [isUniqueEmail, isUniqueStaffId, isUniquePhone] = await Promise.all([
    adminRepository
      .createQueryBuilder('admin')
      .where('LOWER(admin.email) = :email', {
        email: adminData.email.toLowerCase(),
      })
      .getCount(),

    adminRepository
      .createQueryBuilder('admin')
      .where('admin.staffId = :staffId AND admin.siteId = :siteId', {
        staffId: adminData.staffId.toLowerCase(),
        siteId: adminData.siteId,
      })
      .getCount(),

    adminRepository.countBy({
      phone: adminData.phone,
      siteId: adminData.siteId,
    }),
  ]);

  adminData.staffId = adminData.staffId.toLowerCase();
  adminData.role = adminData.role.replace(' ', '_') as AdminRoles;

  if (isUniqueEmail >= 1)
    return DefaultJsonResponse('Admin with Email already exists', null, false);

  if (isUniqueStaffId >= 1)
    return DefaultJsonResponse(
      'Admin with Staff ID already exists',
      null,
      false
    );

  if (isUniquePhone >= 1)
    return DefaultJsonResponse(
      'Admin with Phone Number already exists',
      null,
      false
    );

  const newAdmin = new Admin(adminData);

  const admin = await adminRepository.save(newAdmin);

  return DefaultJsonResponse(
    admin
      ? 'Admin Creation Successful'
      : 'Something happened. Error happened while creating Admin',
    admin,
    !!admin
  );
};
