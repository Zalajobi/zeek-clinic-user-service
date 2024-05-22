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
import { SEVEN_DAYS_SECONDS, TWENTY_FOUR_HOURS_SECONDS } from '@util/config';

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
          rememberMe: requestBody.rememberMe,
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
          requestBody?.rememberMe
            ? SEVEN_DAYS_SECONDS
            : TWENTY_FOUR_HOURS_SECONDS
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
