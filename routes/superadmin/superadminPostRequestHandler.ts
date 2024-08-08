import { NextFunction, Request, Response, Router } from 'express';
import { getSuperAdminLoginData } from '@datastore/superAdmin/superadminGetStore';
import { JsonApiResponse } from '@util/responses';
import { LoginRequestSchema } from '../../schemas/commonSchemas';
import redisClient from '@lib/redis';
import { SEVEN_DAYS_SECONDS, TWENTY_FOUR_HOURS_SECONDS } from '@util/constants';
import jwtClient from '@lib/jwt';
import cryptoClient from '@lib/crypto';

const superadminPostRequest = Router();

superadminPostRequest.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    let responseMessage = 'Incorrect Credentials',
      success = false;

    try {
      const requestBody = LoginRequestSchema.parse(req.body);

      const admin = await getSuperAdminLoginData(requestBody.email);

      if (
        cryptoClient.validatePassword(
          requestBody.password,
          admin?.password ?? ''
        )
      ) {
        const jwtData = {
          id: admin?.id,
          email: admin?.email,
          role: admin?.role,
          rememberMe: requestBody.rememberMe,
        };

        const accessToken = jwtClient.generateJWTAccessToken(jwtData);
        const refreshToken = jwtClient.generateJWTRefreshToken(jwtData);

        await redisClient.setRedisKey(
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
