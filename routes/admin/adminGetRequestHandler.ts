import { Router } from 'express';
import { JWTDataProps } from '../../types/jwt';
import { verifyJSONToken } from '../../helpers/utils';
import { JsonResponse } from '../../util/responses';
import { verifyUserPermission } from '../../lib/auth';
import { getAdminHeaderBaseTemplateData } from '../../datastore/adminStore';

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
        return JsonResponse(res, 'Token is valid', true, null, 200);
      else return JsonResponse(res, 'Token is invalid', false, null, 401);
    } catch (error) {
      let message = 'Something Went Wrong';
      if (error instanceof Error) message = error.message;

      return JsonResponse(res, message, false, null, 403);
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

    if (!verifiedUser) return JsonResponse(res, message, success, null, 403);

    const data = await getAdminHeaderBaseTemplateData(
      verifiedUser?.id as string
    );

    if (!data) JsonResponse(res, 'Something Went Wrong', false, null, 403);

    return JsonResponse(res, 'Success', true, data, 200);
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonResponse(res, message, success, null, 403);
  }
});

export default adminGetRequestHandler;
