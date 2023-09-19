import { Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { getSuperadminBaseData } from '@datastore/superadminStore';
import { getDepartmentDataBySiteId } from '@datastore/departmentStore';
import { AdminRoles } from '@typeorm/entity/enums';

const superadminGetRouter = Router();

superadminGetRouter.get('/profile/get-data', async (req, res) => {
  let success = false;
  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN']
    );

    if (!verifiedUser)
      return JsonApiResponse(res, 'Not Authorized', false, null, 401);

    const data = await getSuperadminBaseData(verifiedUser?.id as string);

    if (data) return JsonApiResponse(res, 'Authorized', true, data, 200);
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 403);
  }
});

// Get Available roles and departments for create Admin for specific site
superadminGetRouter.get(
  '/get/available-admin/roles_and_departments',
  async (req, res) => {
    let success = false,
      message = 'Not Authorized';
    try {
      const { siteId } = req.query;
      let roles: { name: string }[] = [];
      const verifiedUser = await verifyUserPermission(
        req?.headers?.token as string,
        ['SUPER_ADMIN', 'SITE_ADMIN', 'HOSPITAL_ADMIN']
      );

      if (!verifiedUser)
        return JsonApiResponse(res, 'Not Authorized', success, null, 500);

      Object.keys(AdminRoles).forEach((item) => {
        if (item !== 'HOSPITAL_ADMIN' && item !== 'SUPER_ADMIN') {
          roles.push({
            name: item.replace('_', ' '),
          });
        }
      });

      return JsonApiResponse(
        res,
        'Roles and departments data fetch successful',
        true,
        {
          department: await getDepartmentDataBySiteId(siteId as string),
          role: roles,
        },
        200
      );
    } catch (error) {
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, success, null, 401);
    }
  }
);

export default superadminGetRouter;
