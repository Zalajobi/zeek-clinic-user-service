import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { createServiceArea } from '@datastore/serviceArea/serviceAreaPostStore';
import { createServiceAreaRequestSchema } from '@lib/schemas/serviceAreaSchemas';

const serviceAreaPostRequest = Router();

serviceAreaPostRequest.post(
  '/create',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = createServiceAreaRequestSchema.parse({
        ...req.headers,
        ...req.body,
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

      const newRole = await createServiceArea(requestBody);

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

export default serviceAreaPostRequest;
