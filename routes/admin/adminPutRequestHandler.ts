import { Router } from 'express';
import { JWTDataProps } from '../../types/jwt';
import {
  generatePasswordHash,
  validatePassword,
  verifyJSONToken,
} from '@helpers/utils';
import { JsonApiResponse } from '@util/responses';
import {
  getAdminBaseDataAndProfileDataByAdminId,
  updateAdminPasswordByAdminId,
} from '@datastore/adminStore';

const adminPutRequestHandler = Router();

// Change Password When via password reset token
adminPutRequestHandler.put(
  `/admin/password/change_password`,
  async (req, res) => {
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

          if (
            await updateAdminPasswordByAdminId(verifyToken?.id ?? '', password)
          )
            message = 'Password Updated';
        }
      }

      return JsonApiResponse(res, message, true, null, 200);
    } catch (error) {
      let message = 'Something Went Wrong';
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, false, null, 403);
    }
  }
);

export default adminPutRequestHandler;
