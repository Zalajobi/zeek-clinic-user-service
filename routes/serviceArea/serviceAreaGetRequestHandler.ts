import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import {
  fetchFilteredServiceAreaData,
  getServiceAreaCountBySiteId,
} from '@datastore/serviceArea/serviceAreaGetStore';
import { getOrganisationServiceAreaFilterRequestSchema } from '../../schemas/serviceAreaSchemas';
import { authorizeRequest } from '@middlewares/jwt';
import { siteIdRequestSchema } from '../../schemas/commonSchemas';

const serviceAreaGetRequest = Router();

serviceAreaGetRequest.get(
  '/organization/service-areas/filters',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = getOrganisationServiceAreaFilterRequestSchema.parse({
        ...req.query,
        ...req.headers,
      });

      const deptData = await fetchFilteredServiceAreaData(
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
            area: deptData.data[0],
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

serviceAreaGetRequest.get(
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
      const count = await getServiceAreaCountBySiteId(siteId);

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

export default serviceAreaGetRequest;
