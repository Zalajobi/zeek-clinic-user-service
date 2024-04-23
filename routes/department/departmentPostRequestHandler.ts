import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { createNewDepartment } from '@datastore/department/departmentPostStore';
import { createDepartmentRequestSchema } from '@lib/schemas/departmentSchemas';
import { authorizeRequest } from '@middlewares/jwt';

const departmentPostRequest = Router();

departmentPostRequest.post(
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
      const requestBody = createDepartmentRequestSchema.parse({
        ...req.body,
        ...req.headers,
      });

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
