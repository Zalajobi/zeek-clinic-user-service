import { NextFunction, Request, Response } from 'express';
import { bearerTokenSchema } from '../schemas/commonSchemas';

import { JsonApiResponse } from '@util/responses';
import redisClient from '@lib/redis';
import jwtClient from '@lib/jwt';
import { FIVE_MINUTE } from '@util/constants';

const whitelistedEndpoints = [
  '/admin/login',
  '/super-admin/login',
  '/admin/password-reset-requests',
  '/admin/password/reset/user_verification/',
  '/admin/password-reset-requests',
  '/admin/password/reset/user_verification/',
  '/admin/password/reset/user_verification/',
  '/admin/password/change-password',
];

// Verify User has permission to access the endpoint... Skip verification for whitelisted endpoints
export const authorizeRequest = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (whitelistedEndpoints.some((whitelist) => req.url.includes(whitelist))) {
      return next();
    }

    const { cookie: accessToken } = bearerTokenSchema.parse(req.headers);

    if (!accessToken) {
      return JsonApiResponse(res, 'Not Authorized', false, null, 401);
    }

    try {
      const tokenUser = jwtClient.verifyJSONToken(accessToken, false);

      if (tokenUser) {
        const remainingTime = Number(tokenUser?.exp) * 1000 - Date.now();

        if (remainingTime < FIVE_MINUTE) {
          console.log('Remaining time less than 5 minutes');
          const refreshToken = await redisClient.getRedisKey(
            tokenUser?.id ?? ''
          );
          const verifiedRefreshToken = jwtClient.verifyJSONToken(
            refreshToken as string,
            true
          );

          if (verifiedRefreshToken) {
            const { exp, iat, ...tokenPayload } = verifiedRefreshToken;
            const newAccessToken =
              jwtClient.generateJWTAccessToken(tokenPayload);

            res.cookie('accessToken', newAccessToken, {
              httpOnly: true,
              secure: true,
            });

            console.log('Access Token Refreshed');

            if (!roleAuthorization(tokenPayload?.role ?? '', permissions)) {
              return JsonApiResponse(res, 'Not Authorized', false, null, 401);
            }
          } else {
            return JsonApiResponse(res, 'Not Authorized', false, null, 401);
          }
        } else {
          console.log('Remaining time more than 5 minutes');

          if (!roleAuthorization(tokenUser?.role ?? '', permissions)) {
            return JsonApiResponse(res, 'Not Authorized', false, null, 401);
          }
        }
      } else {
        return JsonApiResponse(res, 'Not Authorized', false, null, 401);
      }
    } catch (err: any) {
      return JsonApiResponse(
        res,
        'Internal Server Error',
        false,
        err.message,
        500
      );
    }

    next();
  };
};

const roleAuthorization = (role: string, roleRequired: string[]): boolean => {
  for (const item of roleRequired) {
    if (item === role) return true;
  }

  return false;
};
