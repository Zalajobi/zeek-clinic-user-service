import { NextFunction, Request, Response, Router } from 'express';
import { getSuperAdminLoginData } from '@datastore/superAdmin/superadminGetStore';
import { JsonApiResponse } from '@util/responses';
import { LoginRequestSchema } from '@lib/schemas/commonSchemas';
import {
  generateJWTAccessToken,
  generateJWTRefreshToken,
  setRedisKey,
  validatePassword,
} from '@util/index';

const superadminPostRequest = Router();

superadminPostRequest.post(
  '/auth/login',
  async (req: Request, res: Response, next: NextFunction) => {
    let responseMessage = 'Incorrect Credentials',
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

        setRedisKey(
          admin?.id ?? '',
          refreshToken,
          requestBody?.rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60
        );
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: true,
        });
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
