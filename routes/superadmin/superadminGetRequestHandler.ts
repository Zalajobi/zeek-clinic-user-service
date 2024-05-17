import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { getSuperAdminBaseData } from '@datastore/superAdmin/superadminGetStore';
import { AdminRoles } from '@typeorm/entity/enums';
import { getDepartmentDataBySiteId } from '@datastore/department/departmentGetStore';
import { getDepartmentsBySiteIdRequestSchema } from '@lib/schemas/adminSchemas';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';
import { authorizeRequest } from '@middlewares/jwt';
import { verifyJSONToken } from '@util/index';

const superadminGetRouter = Router();

/**
 * Fetches base profile data for superadministrators. This endpoint is secured with
 * bearer token authentication, ensuring that only users with a 'SUPER_ADMIN' role can access it.
 * The token should be provided in the Authorization header.
 *
 * @route GET /profile/get-data
 * @header {string} token - token required for verifying superadmin privileges.
 * @returns {JSON} On success, returns a JSON response with the superadmin's base data and
 *                 a message 'Authorized'. If unauthorized, returns 'Not Authorized' with a
 *                 401 status. Errors are handled by the next middleware.
 */
superadminGetRouter.get(
  '/profile/get-data',
  authorizeRequest(['SUPER_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cookie } = bearerTokenSchema.parse(req.headers);

      const user = verifyJSONToken(cookie ?? '');

      const data = await getSuperAdminBaseData(user?.id ?? '');

      if (data) return JsonApiResponse(res, 'Authorized', true, data, 200);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Retrieves available roles and departments for administrators. This endpoint
 * is designed for users with elevated permissions (SUPER_ADMIN, SITE_ADMIN, HOSPITAL_ADMIN)
 * and requires a bearer token for authentication. The token and siteId are expected to be
 * included in the headers and query parameters, respectively.
 *
 * @route GET /get/available-admin/roles_and_departments
 * @header {string} token - token required for verifying superadmin privileges.
 * @query {string} siteId - Site identifier used to fetch relevant department data.
 * @returns {JSON} On success, returns a list of roles and departments. If unauthorized or if
 *                 any errors occur, forwards the error to the next middleware and
 *                 potentially returns a 401 Unauthorized response.
 */
superadminGetRouter.get(
  '/get/available-admin/roles_and_departments',
  authorizeRequest(['SUPER_ADMIN', 'SITE_ADMIN', 'HOSPITAL_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = getDepartmentsBySiteIdRequestSchema.parse({
        ...req.query,
        ...req?.headers,
      });

      let roles: { name: string }[] = [];
      Object.keys(AdminRoles).forEach((item) => {
        if (item !== 'HOSPITAL_ADMIN' && item !== 'SUPER_ADMIN') {
          roles.push({
            name: item.replace('_', ' '),
          });
        }
      });

      return JsonApiResponse(
        res,
        'Roles and departments data fetch successful',
        true,
        {
          department: await getDepartmentDataBySiteId(requestBody.siteId),
          role: roles,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

export default superadminGetRouter;
