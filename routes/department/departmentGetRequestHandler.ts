import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import {
  fetchFilteredDepartmentData,
  getDepartmentCountBySiteId,
  getDepartmentDataBySiteId,
} from '@datastore/department/departmentGetStore';
import { getOrganisationDepartmentsFilterRequestSchema } from '../../schemas/departmentSchemas';
import { authorizeRequest } from '@middlewares/jwt';
import { siteIdRequestSchema } from '../../schemas/commonSchemas';

const departmentGetRequest = Router();

departmentGetRequest.get(
  '/get-all/:siteId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { siteId } = siteIdRequestSchema.parse(req.params);

    try {
      const departments = await getDepartmentDataBySiteId(siteId);

      return JsonApiResponse(res, 'Success', true, departments, 200);
    } catch (error) {
      next(error);
    }
  }
);

departmentGetRequest.get(
  '/organization/roles/filters',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = getOrganisationDepartmentsFilterRequestSchema.parse(
        req.query
      );

      const { page, per_page, from_date, to_date, search, country, status } =
        req.query;

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

      return JsonApiResponse(res, 'Something went wrong', false, null, 200);
    } catch (error) {
      next(error);
    }
  }
);

departmentGetRequest.get(
  '/count/:siteId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { siteId } = siteIdRequestSchema.parse(req.params);

    try {
      const count = await getDepartmentCountBySiteId(siteId);

      if (count) {
        return JsonApiResponse(
          res,
          'Success',
          true,
          {
            totalRows: count,
          },
          200
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default departmentGetRequest;
