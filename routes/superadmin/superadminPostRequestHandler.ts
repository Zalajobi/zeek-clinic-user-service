import { NextFunction, Request, Response, Router } from 'express';
import { getSuperAdminLoginData } from '@datastore/superAdmin/superadminGetStore';
import {
  generateJSONTokenCredentials,
  generateJWTAccessToken,
  generateJWTRefreshToken,
  validatePassword,
} from '@helpers/utils';
import { JsonApiResponse } from '@util/responses';
import { LoginRequestSchema } from '@lib/schemas/commonSchemas';
import redisClient from '@util/redis';

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

        const accessToken = generateJWTAccessToken(
          jwtData,
          requestBody.rememberMe
        );
        const refreshToken = generateJWTRefreshToken(
          jwtData,
          requestBody.rememberMe
        );

        const client = redisClient.getClient();

        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: true,
        });
        // res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
        responseMessage = 'Login Successful';
        success = true;
      }

      return JsonApiResponse(res, responseMessage, success, null, 200);
    } catch (error) {
      next(error);
    }
  }
);

export default superadminPostRequest;
