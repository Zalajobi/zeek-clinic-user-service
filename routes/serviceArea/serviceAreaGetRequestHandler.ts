import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { fetchFilteredServiceAreaData } from '@datastore/serviceArea/serviceAreaGetStore';
import { getOrganisationServiceAreaFilterRequestSchema } from '@lib/schemas/serviceAreaSchemas';

const serviceAreaGetRequest = Router();

serviceAreaGetRequest.get(
  '/organization/service-areas/filters',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = getOrganisationServiceAreaFilterRequestSchema.parse({
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

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

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

      return JsonApiResponse(res, 'Something went wrong', success, null, 200);
    } catch (error) {
      next(error);
    }
  }
);

export default serviceAreaGetRequest;
