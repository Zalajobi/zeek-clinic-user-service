import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { fetchFilteredServiceAreaData } from '@datastore/serviceArea/serviceAreaGetStore';
import { getOrganisationServiceAreaFilterRequestSchema } from '@lib/schemas/serviceAreaSchemas';
import { authorizeRequest } from '@middlewares/jwt';

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

export default serviceAreaGetRequest;
