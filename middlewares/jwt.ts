import { NextFunction, Request, Response } from 'express';
import { verifyUserPermission } from '@lib/auth';

// Verify User has permission to access the endpoint... Skip verification for whitelisted endpoints
export const verifyUserPermissionMiddleware = (permissions: string[]) => {
  const whitelistedEndpoints = ['/admin/login', '/super-admin/login'];

  return (req: Request, res: Response, next: NextFunction) => {
    if (whitelistedEndpoints.some((whitelist) => req.url.includes(whitelist))) {
      next();
    } else {
      const token = req.headers.token;
      const verifiedUser = verifyUserPermission(token as string, permissions);

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
