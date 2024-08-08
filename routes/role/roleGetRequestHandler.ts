import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import {
  countRoleItemsByMonth,
  getRoleCountBySiteId,
  getRolePaginationDataWithUsersCount,
} from '@datastore/role/roleGetStore';
import { getOrganisationRolesFilterRequestSchema } from '../../schemas/roleSchemas';
import { authorizeRequest } from '@middlewares/auth';
import {
  getChartRequestSchema,
  siteIdRequestSchema,
} from '../../schemas/commonSchemas';

const roleGetRequest = Router();

roleGetRequest.get(
  `/organization/roles/filters`,
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = getOrganisationRolesFilterRequestSchema.parse({
        ...req.headers,
        ...req.query,
      });

      const roleData = await getRolePaginationDataWithUsersCount(
        requestBody.page,
        requestBody.per_page,
        requestBody.search ?? '',
        requestBody.from_date ?? '',
        requestBody.to_date ?? '',
        requestBody.siteId
      );

      if (roleData.success)
        return JsonApiResponse(
          res,
          roleData.message,
          <boolean>roleData?.success,
          {
            role: roleData.data[0],
            count: roleData.data[1],
          },
          200
        );

      return JsonApiResponse(res, 'Something went wrong', false, null, 200);
    } catch (error) {
      next(error);
    }
  }
);

roleGetRequest.get(
  '/count/:siteId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { siteId } = siteIdRequestSchema.parse(req.params);
      const count = await getRoleCountBySiteId(siteId);

      if (count)
        return JsonApiResponse(
          res,
          'Role count retrieved successfully',
          true,
          {
            totalRows: count,
          },
          200
        );

      return JsonApiResponse(res, 'Something went wrong', false, null, 200);
    } catch (error) {
      next(error);
    }
  }
);

roleGetRequest.get(
  '/chart',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fromDate, toDate, siteId, groupBy } = getChartRequestSchema.parse(
        req.query
      );

      const roleData = await countRoleItemsByMonth(
        new Date(fromDate),
        new Date(toDate),
        groupBy,
        siteId
      );

      if (roleData)
        return JsonApiResponse(
          res,
          'Role chart data retrieved successfully',
          true,
          roleData,
          200
        );

      return JsonApiResponse(res, 'Something went wrong', false, null, 200);
    } catch (error) {
      next(error);
    }
  }
);

export default roleGetRequest;
