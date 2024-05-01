import { NextFunction, Request, Response, Router } from 'express';
import { verifyJSONToken } from '@helpers/utils';
import { JsonApiResponse } from '@util/responses';
import { adminCreateProviderGetServiceAreaDataBySiteId } from '@datastore/serviceArea/serviceAreaGetStore';
import {
  getAdminDetails,
  getAdminFullProfileData,
} from '@datastore/admin/adminGetStore';
import { adminCreateProviderGetDepartmentDataBySiteId } from '@datastore/department/departmentGetStore';
import { getRoleDataBySiteId } from '@datastore/role/roleGetStore';
import { getUnitDataBySiteID } from '@datastore/unit/unitGetStore';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';
import { getDepartmentUnitServiceAreaAndRoleRequestSchema } from '@lib/schemas/patientSchemas';
import { authorizeRequest } from '@middlewares/jwt';
import { AUTHORIZE_ALL_ADMINS } from '@util/config';

const adminGetRequestHandler = Router();

// Verify Token with JWT and update Password
adminGetRequestHandler.get(
  '/password/request-password/jwt_token/verify',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const verifyToken = verifyJSONToken(req.query.token as string);

      if (verifyToken)
        return JsonApiResponse(res, 'Token is valid', true, null, 200);
      else return JsonApiResponse(res, 'Token is invalid', false, null, 401);
    } catch (error) {
      next(error);
    }
  }
);

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
      const { siteId } = getDepartmentUnitServiceAreaAndRoleRequestSchema.parse(
        {
          ...req.headers,
          ...req.params,
        }
      );

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

// Get Admin Base Data for Dashboard header
adminGetRequestHandler.get(
  '/profile/details',
  authorizeRequest([
    'ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'HUMAN_RESOURCES',
    'HMO_ADMIN',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = bearerTokenSchema.parse(req.headers);
      const userData = verifyJSONToken(token);

      const data = await getAdminFullProfileData(userData?.id as string);

      if (!data)
        return JsonApiResponse(res, 'Something Went Wrong', false, null, 401);

      return JsonApiResponse(res, 'Success', true, data, 200);
    } catch (error) {
      next(error);
    }
  }
);

// Get Admin Data
adminGetRequestHandler.get(
  '/details',
  authorizeRequest(AUTHORIZE_ALL_ADMINS),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = bearerTokenSchema.parse(req.headers);
      const userData = verifyJSONToken(token);

      const adminData = await getAdminDetails(userData?.id ?? '');

      return JsonApiResponse(res, 'Success', true, adminData, 200);
    } catch (error) {
      next(error);
    }
  }
);

// Get Admin Personal Info Data

export default adminGetRequestHandler;
