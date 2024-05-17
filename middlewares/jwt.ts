import { NextFunction, Request, Response } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';
import {
  generateJWTAccessToken,
  getRedisKey,
  verifyJSONToken,
} from '@util/index';

// Verify User has permission to access the endpoint... Skip verification for whitelisted endpoints
export const authorizeRequest = (permissions: string[]) => {
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

  return async (req: Request, res: Response, next: NextFunction) => {
    if (whitelistedEndpoints.some((whitelist) => req.url.includes(whitelist))) {
      next();
    } else {
      const { cookie: accessToken } = bearerTokenSchema.parse(req.headers);

      // If Access token is not retrieved from cookies
      if (!accessToken)
        return res.status(401).json({
          success: false,
          data: null,
          message: 'Not Authorized',
        });

      const tokenUser = verifyJSONToken(accessToken);
      if (tokenUser) {
        const remainingTime = Number(tokenUser?.exp) * 1000 - Date.now();

        // If the remaining time is above 5 minutes, check if the role is authorized,
        // else, reset the accessToken and also check if permitted to visit the url
        if (remainingTime < 5 * 60 * 1000) {
          const refreshToken = await getRedisKey(tokenUser?.id ?? '');
          const verifiedRefreshToken = verifyJSONToken(refreshToken ?? '');
          if (verifiedRefreshToken) {
            const { exp, iat, ...tokenPayload } = verifiedRefreshToken;
            const accessToken = generateJWTAccessToken(tokenPayload, false);
            res.cookie('accessToken', accessToken, {
              httpOnly: true,
              secure: true,
            });

            // Check if user has permission for the request
            if (!roleAuthorization(tokenPayload?.role ?? '', permissions)) {
              return res.status(401).json({
                success: false,
                data: null,
              });
            }
          }
        } else {
          // Check if user has permission for the request
          if (!roleAuthorization(tokenUser?.role ?? '', permissions)) {
            return res.status(401).json({
              success: false,
              data: null,
            });
          }
        }
      }

      next();
    }
  };
};

const roleAuthorization = (role: string, roleRequired: string[]): boolean => {
  for (const item of roleRequired) {
    if (item === role) return true;
  }

  return false;
};
