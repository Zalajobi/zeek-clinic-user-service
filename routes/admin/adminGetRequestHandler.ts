import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { adminCreateProviderGetServiceAreaDataBySiteId } from '@datastore/serviceArea/serviceAreaGetStore';
import {
  getAdminCountBySiteId,
  getAdminDetails,
} from '@datastore/admin/adminGetStore';
import { adminCreateProviderGetDepartmentDataBySiteId } from '@datastore/department/departmentGetStore';
import { getRoleDataBySiteId } from '@datastore/role/roleGetStore';
import { getUnitDataBySiteID } from '@datastore/unit/unitGetStore';
import {
  idRequestSchema,
  siteIdRequestSchema,
} from '../../schemas/commonSchemas';
import { authorizeRequest } from '@middlewares/auth';
import { AUTHORIZE_ALL_ADMINS } from '@util/config';

const adminGetRequestHandler = Router();

// // Verify Token with JWT and update Password
// adminGetRequestHandler.get(
//   '/password/request-password/jwt_token/verify',
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const verifyToken = verifyJSONToken(req.query.authorization as string);
//
//       if (verifyToken)
//         return JsonApiResponse(res, 'Token is valid', true, null, 200);
//       else return JsonApiResponse(res, 'Token is invalid', false, null, 401);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// Get Roles, Departments, Units and Service Area of a site
adminGetRequestHandler.get(
  '/roles-departments-areas-units/:siteId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { siteId } = siteIdRequestSchema.parse(req.params);

      const response = await Promise.all([
        adminCreateProviderGetDepartmentDataBySiteId(siteId),

        getUnitDataBySiteID(siteId),

        adminCreateProviderGetServiceAreaDataBySiteId(siteId),

        getRoleDataBySiteId(siteId),
      ]);

      if (response) {
        return JsonApiResponse(
          res,
          'Success',
          true,
          {
            departments: response[0],
            units: response[1],
            serviceAreas: response[2],
            roles: response[3],
          },
          200
        );
      }

      return JsonApiResponse(res, 'Something went wrong', false, null, 401);
    } catch (error) {
      next(error);
    }
  }
);

// Get Admin Data
adminGetRequestHandler.get(
  '/:id',
  authorizeRequest(AUTHORIZE_ALL_ADMINS),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = idRequestSchema.parse(req.params);

      const { data, success, message } = await getAdminDetails(id ?? '');

      return JsonApiResponse(res, message, success, data, 200);
    } catch (error) {
      next(error);
    }
  }
);

// Get count of Admin(s) in a site
adminGetRequestHandler.get(
  '/count/:siteId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { siteId } = siteIdRequestSchema.parse(req.params);

    try {
      const count = await getAdminCountBySiteId(siteId);

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

export default adminGetRequestHandler;
