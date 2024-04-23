import { NextFunction, Request, Response, Router } from 'express';
import { JWTDataProps } from '@typeDesc/jwt';
import { verifyJSONToken } from '@helpers/utils';
import { JsonApiResponse } from '@util/responses';
import { verifyUserPermission } from '@lib/auth';
import { adminCreateProviderGetServiceAreaDataBySiteId } from '@datastore/serviceArea/serviceAreaGetStore';
import { getAdminHeaderBaseTemplateData } from '@datastore/admin/adminGetStore';
import { adminCreateProviderGetDepartmentDataBySiteId } from '@datastore/department/departmentGetStore';
import { getRoleDataBySiteId } from '@datastore/role/roleGetStore';
import { getUnitDataBySiteID } from '@datastore/unit/unitGetStore';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';
import { getDepartmentUnitServiceAreaAndRoleRequestSchema } from '@lib/schemas/patientSchemas';

const adminGetRequestHandler = Router();

// Verify Token with JWT and update Password
adminGetRequestHandler.get(
  '/password/request-password/jwt_token/verify',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const verifyToken = <JWTDataProps>(
        (<unknown>verifyJSONToken(req.query.token as string))
      );

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
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const { siteId, token } =
        getDepartmentUnitServiceAreaAndRoleRequestSchema.parse({
          ...req.headers,
          ...req.params,
        });

      const verifiedUser = await verifyUserPermission(token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'HUMAN_RESOURCES',
      ]);

      if (!verifiedUser) {
        return JsonApiResponse(res, message, success, null, 200);
      }

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
  async (req: Request, res: Response, next: NextFunction) => {
    let success = false,
      message = 'Not Authorized';
    try {
      const { token } = bearerTokenSchema.parse(req.headers);

      const verifiedUser = await verifyUserPermission(token, [
        'ADMIN',
        'RECORDS',
        'CASHIER',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'HUMAN_RESOURCES',
        'HMO_ADMIN',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

      const data = await getAdminHeaderBaseTemplateData(
        verifiedUser?.id as string
      );

      if (!data)
        return JsonApiResponse(res, 'Something Went Wrong', false, null, 401);

      return JsonApiResponse(res, 'Success', true, data, 200);
    } catch (error) {
      next(error);
    }
  }
);

export default adminGetRequestHandler;
