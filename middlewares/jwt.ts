import { NextFunction, Request, Response } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';

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

  return (req: Request, res: Response, next: NextFunction) => {
    if (whitelistedEndpoints.some((whitelist) => req.url.includes(whitelist))) {
      next();
    } else {
      const { authorization } = bearerTokenSchema.parse(req.headers);
      const verifiedUser = verifyUserPermission(authorization, permissions);

      if (!verifiedUser) {
        return res.status(401).json({
          message: 'Not Authorized',
          success: false,
          data: null,
        });
      } else {
        next();
      }
    }
  };
};
