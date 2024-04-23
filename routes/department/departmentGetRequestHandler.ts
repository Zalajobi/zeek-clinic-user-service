import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { verifyUserPermission } from '@lib/auth';
import {
  fetchFilteredDepartmentData,
  getDepartmentDataBySiteId,
} from '@datastore/department/departmentGetStore';
import { getOrganisationDepartmentsFilterRequestSchema } from '@lib/schemas/departmentSchemas';

const departmentGetRequest = Router();

departmentGetRequest.get(
  '/get-all/:siteId',
  async (req: Request, res: Response, next: NextFunction) => {
    const siteId = req.params.siteId as string;
    let message = 'Not Authorised',
      success = false;

    try {
      const verifiedUser = verifyUserPermission(req?.headers?.token as string, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 200);

      const departments = await getDepartmentDataBySiteId(siteId);

      return JsonApiResponse(res, 'Success', true, departments, 200);
    } catch (error) {
      next(error);
    }
  }
);

departmentGetRequest.get(
  '/organization/roles/filters',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = getOrganisationDepartmentsFilterRequestSchema.parse({
        ...req.query,
        ...req.headers,
      });

      const verifiedUser = verifyUserPermission(requestBody.token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]);

      const { page, per_page, from_date, to_date, search, country, status } =
        req.query;

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

      const deptData = await fetchFilteredDepartmentData(
        requestBody.page,
        requestBody.per_page,
        requestBody.search,
        requestBody.from_date,
        requestBody.to_date,
        requestBody.siteId
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
      next(error);
    }
  }
);

export default departmentGetRequest;
