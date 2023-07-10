import { Router } from 'express';
import { verifyUserPermission } from '../../lib/auth';
import { JsonResponse } from '../../util/responses';
import {
  getSuperadminBaseData,
  getSuperadminDataById,
} from '../../datastore/superadminStore';
import { getOneAdminDataById } from '../../datastore/adminStore';
import { getDepartmentDataBySiteId } from '../../datastore/departmentStore';
import { getRoleDataBySiteId } from '../../datastore/roleStore';

const superadminGetRouter = Router();

superadminGetRouter.get('/profile/get-data', async (req, res) => {
  let success = false;
  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN']
    );

    if (!verifiedUser)
      return JsonResponse(res, 'Not Authorized', false, null, 401);

    const data = await getSuperadminBaseData(verifiedUser?.id as string);

    if (data) return JsonResponse(res, 'Authorized', true, data, 200);
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonResponse(res, message, success, null, 403);
  }
});

superadminGetRouter.get('/get/roles_and_departments', async (req, res) => {
  let success = false,
    message = 'Not Authorized';
  try {
    const { siteId } = req.query;
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN', 'SITE_ADMIN', 'HOSPITAL_ADMIN']
    );

    if (!verifiedUser)
      return JsonResponse(res, 'Not Authorized', success, null, 403);

    const admin = await Promise.all([
      getOneAdminDataById(verifiedUser?.id as string),

      getSuperadminDataById(verifiedUser?.id as string),
    ]);

    if (admin[0]?.id === siteId || admin[1]) {
      const response = await Promise.all([
        getDepartmentDataBySiteId(siteId as string),

        getRoleDataBySiteId(siteId as string),
      ]);

      return JsonResponse(
        res,
        'Roles and departments data fetch successful',
        true,
        {
          department: response[0],
          role: response[1],
        },
        200
      );
    }

    return JsonResponse(res, message, success, null, 403);
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonResponse(res, message, success, null, 403);
  }
});

export default superadminGetRouter;
