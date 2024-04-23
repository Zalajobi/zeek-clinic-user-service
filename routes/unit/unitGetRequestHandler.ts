import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { fetchFilteredUnitData } from '@datastore/unit/unitGetStore';
import { getOrganisationUnitsFilterRequestSchema } from '@lib/schemas/unitSchemas';

const unitGetRequest = Router();

unitGetRequest.get(
  '/organization/roles/filters',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = getOrganisationUnitsFilterRequestSchema.parse({
        ...req.headers,
        ...req.query,
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
          <boolean>deptData?.success,
          {
            units: deptData.data[0],
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

export default unitGetRequest;
