import { NextFunction, Request, Response, Router } from 'express';
import { getSuperAdminLoginData } from '@datastore/superAdmin/superadminGetStore';
import { generateJSONTokenCredentials, validatePassword } from '@helpers/utils';
import { JsonApiResponse } from '@util/responses';
import { LoginRequestSchema } from '@lib/schemas/commonSchemas';
import * as console from 'console';

const superadminPostRequest = Router();

superadminPostRequest.post(
  '/auth/login',
  async (req: Request, res: Response, next: NextFunction) => {
    let responseMessage = 'Incorrect Credentials',
      jwtSignData = null,
      success = false;

    try {
      const requestBody = LoginRequestSchema.parse(req.body);

      const admin = await getSuperAdminLoginData(requestBody.email);

      if (validatePassword(requestBody.password, admin?.password ?? '')) {
        const jwtData = {
          id: admin?.id,
          email: admin?.email,
          role: admin?.role,
        };

        jwtSignData = generateJSONTokenCredentials(
          jwtData,
          Math.floor(Date.now() / 1000) + 60 * 360
        );

        responseMessage = 'Login Successful';
        success = true;
      }

      return JsonApiResponse(
        res,
        responseMessage,
        success,
        {
          token: jwtSignData,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

export default superadminPostRequest;
