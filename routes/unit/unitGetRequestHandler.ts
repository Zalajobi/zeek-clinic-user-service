import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import {
  fetchFilteredUnitData,
  getUnitCountBySiteId,
} from '@datastore/unit/unitGetStore';
import { getOrganisationUnitsFilterRequestSchema } from '../../schemas/unitSchemas';
import { authorizeRequest } from '@middlewares/jwt';
import { siteIdRequestSchema } from '../../schemas/commonSchemas';

const unitGetRequest = Router();

unitGetRequest.get(
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
      const requestBody = getOrganisationUnitsFilterRequestSchema.parse(
        req.query
      );

      const deptData = await fetchFilteredUnitData(
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
          deptData?.success,
          {
            units: deptData.data[0],
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

unitGetRequest.get(
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
      const count = await getUnitCountBySiteId(siteId);

      return JsonApiResponse(
        res,
        'Success',
        true,
        {
          totalRows: count,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

export default unitGetRequest;
