import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { getRolePaginationDataWithUsersCount } from '@datastore/role/roleGetStore';
import { getOrganisationRolesFilterRequestSchema } from '@lib/schemas/roleSchemas';

const roleGetRequest = Router();

roleGetRequest.get(
  `/organization/roles/filters`,
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = getOrganisationRolesFilterRequestSchema.parse({
        ...req.headers,
        ...req.query,
      });

      const verifiedUser = await verifyUserPermission(requestBody.token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

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

      return JsonApiResponse(res, 'Something went wrong', success, null, 200);
    } catch (error) {
      next(error);
    }
  }
);

export default roleGetRequest;
