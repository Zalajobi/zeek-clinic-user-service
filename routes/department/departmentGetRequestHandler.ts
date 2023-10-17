import { Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { verifyUserPermission } from '@lib/auth';
import {
  adminGetDepartmentsAndProvidersCount,
  getDepartmentDataBySiteId,
} from '@datastore/department/departmentGetStore';

const departmentGetRequest = Router();

departmentGetRequest.get('/get-all/:siteId', async (req, res) => {
  const siteId = req.params.siteId as string;
  let message = 'Not Authorised',
    success = false;

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]
    );

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 200);

    const departments = await getDepartmentDataBySiteId(siteId);

    return JsonApiResponse(res, 'Success', true, departments, 200);
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 401);
  }
});

departmentGetRequest.get('/list/paginated/:siteId', async (req, res) => {
  const siteId = req.params.siteId as string;
  let message = 'Not Authorised',
    success = false;

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]
    );

    const { page, per_page, from_date, to_date, search, country, status } =
      req.query;

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 401);

    const deptData = await adminGetDepartmentsAndProvidersCount(
      page as unknown as number,
      per_page as unknown as number,
      search as unknown as string,
      from_date as unknown as string,
      to_date as unknown as string,
      siteId as string
    );

    if (deptData.success)
      return JsonApiResponse(
        res,
        deptData.message,
        <boolean>deptData?.success,
        {
          departments: deptData.data[0],
          count: deptData.data[1],
        },
        200
      );

    return JsonApiResponse(res, 'Something went wrong', success, null, 200);
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 500);
  }
});

export default departmentGetRequest;
