import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { getAdminBaseDataAndProfileDataByAdminId } from '@datastore/admin/adminGetStore';
import { updateAdminPasswordByAdminId } from '@datastore/admin/adminPutStore';
import { updatePasswordRequestSchema } from '@lib/schemas/adminSchemas';
import {
  generatePasswordHash,
  validatePassword,
  verifyJSONToken,
} from '@util/index';

const adminPutRequestHandler = Router();

// Change Password When via password reset token
adminPutRequestHandler.put(
  `/password/change-password`,
  async (req: Request, res: Response, next: NextFunction) => {
    const requestBody = updatePasswordRequestSchema.parse({
      ...req.body,
      ...req.headers,
    });

    let message = 'Error Updating Password';
    try {
      const verifyToken = verifyJSONToken(requestBody.authorization, false);

      if (verifyToken) {
        const admin = await getAdminBaseDataAndProfileDataByAdminId(
          verifyToken?.id ?? ''
        );

        if (validatePassword(requestBody.old_password, admin?.password ?? '')) {
          const password = generatePasswordHash(requestBody.new_password);

          if (
            await updateAdminPasswordByAdminId(verifyToken?.id ?? '', password)
          )
            message = 'Password Updated';
        }
      }

      return JsonApiResponse(res, message, true, null, 200);
    } catch (error) {
      next(error);
    }
  }
);

export default adminPutRequestHandler;
