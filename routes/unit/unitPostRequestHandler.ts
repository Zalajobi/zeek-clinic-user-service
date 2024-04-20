import { NextFunction, Request, Response, Router } from 'express';

import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { createNewUnit } from '@datastore/unit/unitPostStore';
import { createUnitRequestSchema } from '@lib/schemas/unitSchemas';

const unitPostRequest = Router();

// Create New Unit
unitPostRequest.post(
  '/create',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = createUnitRequestSchema.parse({
        ...req.headers,
        ...req.body,
      });

      const verifiedUser = await verifyUserPermission(requestBody.token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

      const newRole = await createNewUnit(requestBody);

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

export default unitPostRequest;
