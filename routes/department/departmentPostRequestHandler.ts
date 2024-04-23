import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { createNewDepartment } from '@datastore/department/departmentPostStore';
import { createDepartmentRequestSchema } from '@lib/schemas/departmentSchemas';

const departmentPostRequest = Router();

departmentPostRequest.post(
  '/create',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = createDepartmentRequestSchema.parse({
        ...req.body,
        ...req.headers,
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

      const newRole = await createNewDepartment(requestBody);

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

export default departmentPostRequest;
