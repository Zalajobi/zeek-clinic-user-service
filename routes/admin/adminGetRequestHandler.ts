import { Router } from 'express';
import { JWTDataProps } from '../../types/jwt';
import { verifyJSONToken } from '../../helpers/utils';
import { JsonApiResponse } from '../../util/responses';
import { verifyUserPermission } from '../../lib/auth';
import { getAdminHeaderBaseTemplateData } from '../../datastore/adminStore';
import {
  adminCreateProviderGetDepartmentDataBySiteId,
  getDepartmentDataBySiteId,
} from '../../datastore/departmentStore';
import department from '../department';
import {
  adminCreateProviderGetRolesDataBySiteId,
  getRoleDataBySiteId,
} from '../../datastore/roleStore';
import { adminCreateProviderGetUnitsDataBySiteId } from '../../datastore/unitStore';
import { adminCreateProviderGetServiceAreaDataBySiteId } from '../../datastore/serviceAreaStore';

const adminGetRequestHandler = Router();

// Verify Token with JWT and update Password
adminGetRequestHandler.get(
  '/password/request-password/jwt_token/verify',
  async (req, res) => {
    let message = 'Token has expired',
      success = false;

    try {
      const verifyToken = <JWTDataProps>(
        (<unknown>verifyJSONToken(req.query.token as string))
      );

      if (verifyToken)
        return JsonApiResponse(res, 'Token is valid', true, null, 200);
      else return JsonApiResponse(res, 'Token is invalid', false, null, 401);
    } catch (error) {
      let message = 'Something Went Wrong';
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, false, null, 403);
    }
  }
);

adminGetRequestHandler.get(
  '/provider/create-new/roles-departments-areas-units/:siteId',
  async (req, res) => {
    const siteId = req.params.siteId as string;
    let message = 'Not Authorised',
      success = false;

    try {
      const verifiedUser = await verifyUserPermission(
        req?.headers?.token as string,
        ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'SITE_ADMIN', 'HUMAN_RESOURCES']
      );

      if (!verifiedUser) {
        return JsonApiResponse(res, message, success, null, 200);
      }

      const response = await Promise.all([
        adminCreateProviderGetDepartmentDataBySiteId(siteId),

        adminCreateProviderGetUnitsDataBySiteId(siteId),

        adminCreateProviderGetServiceAreaDataBySiteId(siteId),

        adminCreateProviderGetRolesDataBySiteId(siteId),
      ]);

      if (response) {
        JsonApiResponse(
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
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, success, null, 401);
    }
  }
);

// Get Admin Base Data for Dashboard header
adminGetRequestHandler.get('/profile/get-data', async (req, res) => {
  let success = false,
    message = 'Not Authorized';
  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      [
        'ADMIN',
        'RECORDS',
        'CASHIER',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'HUMAN_RESOURCES',
        'HMO_ADMIN',
      ]
    );

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 403);

    const data = await getAdminHeaderBaseTemplateData(
      verifiedUser?.id as string
    );

    if (!data) JsonApiResponse(res, 'Something Went Wrong', false, null, 403);

    return JsonApiResponse(res, 'Success', true, data, 200);
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 403);
  }
});

export default adminGetRequestHandler;
