import { NextFunction, Request, Response, Router } from 'express';

import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { createNewUnit } from '@datastore/unit/unitPostStore';
import { createUnitRequestSchema } from '@lib/schemas/unitSchemas';
import { authorizeRequest } from '@middlewares/jwt';

const unitPostRequest = Router();

// Create New Unit
unitPostRequest.post(
  '/create',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = createUnitRequestSchema.parse({
        ...req.headers,
        ...req.body,
      });

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
