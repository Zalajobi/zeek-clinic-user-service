import { Router } from 'express';
import { JWTDataProps } from '../../types/jwt';
import { verifyJSONToken } from '../../helpers/utils';
import { JsonResponse } from '../../util/responses';

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

      if (verifyToken) JsonResponse(res, 'Token is valid', true, null, 200);
      else JsonResponse(res, 'Token is invalid', false, null, 401);
    } catch (error) {
      let message = 'Something Went Wrong';
      if (error instanceof Error) message = error.message;

      JsonResponse(res, message, false, null, 403);
    }
  }
);

export default adminGetRequestHandler;
