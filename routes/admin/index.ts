import express = require('express');
import { JsonResponse } from '../../util/responses';
import { adminModelProps } from '../../types';
import { verifyUserPermission } from '../../lib/auth';
import {
  generateCode,
  generateJSONTokenCredentials,
  generatePasswordHash,
  validatePassword,
  verifyJSONToken,
} from '../../helpers/utils';
import {
  createNewAdmin,
  getAdminAndProfileDataByEmailOrUsername,
  getAdminBaseDataAndProfileDataByAdminId,
  getAdminPrimaryInformationAndProfile,
  updateAdminData,
  updateAdminPasswordByAdminId,
} from '../../datastore/adminStore';
import { sendResetPasswordEmail } from '../../messaging/email';
import { JWTDataProps } from '../../types/jwt';
import { AdminEntityObject } from '../../typeorm/objectsTypes/adminObjectTypes';
import adminPostRequestHandler from './postRequestHandler';

const adminRouter = express.Router();

adminRouter.use('/', adminPostRequestHandler);

// Verify Token with JWT and update Password
adminRouter.get(
  '/admin/password/request-password/jwt_token/verify',
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

// Change Password When via password reset token
adminRouter.put(`/admin/password/change_password`, async (req, res) => {
  const { authorization } = req.headers,
    { old_password, new_password } = req.body;
  let message = 'Error Updating Password';

  try {
    const verifyToken = <JWTDataProps>(
      (<unknown>verifyJSONToken(authorization as string))
    );

    if (verifyToken) {
      const admin = await getAdminBaseDataAndProfileDataByAdminId(
        verifyToken?.id ?? ''
      );

      if (validatePassword(old_password, admin?.password ?? '')) {
        const password = generatePasswordHash(new_password);

        if (await updateAdminPasswordByAdminId(verifyToken?.id ?? '', password))
          message = 'Password Updated';
      }
    }

    JsonResponse(res, message, true, null, 200);
  } catch (error) {
    let message = 'Something Went Wrong';
    if (error instanceof Error) message = error.message;

    JsonResponse(res, message, false, null, 403);
  }
});

// Get Admin Base Data for Dashboard header

export default adminRouter;
