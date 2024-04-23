import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { createNewRole } from '@datastore/role/rolePostStore';
import { createAndUpdateRoleRequestSchema } from '@lib/schemas/roleSchemas';

const rolePostRequest = Router();

rolePostRequest.post(
  '/create',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = createAndUpdateRoleRequestSchema.parse({
        ...req.body,
        ...req.headers,
      });

      const verifiedUser = verifyUserPermission(requestBody.token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

      const newRole = await createNewRole(requestBody);

      return JsonApiResponse(
        res,
        newRole.message,
        <boolean>newRole.success,
        null,
        newRole?.success ? 201 : 500
      );
    } catch (error) {
      next(error);
    }
  }
);

export default rolePostRequest;
