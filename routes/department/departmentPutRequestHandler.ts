import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { updateDepartmentDataByDepartmentId } from '@datastore/department/departmentPutStore';
import { updateDepartmentRequestSchema } from '@lib/schemas/departmentSchemas';
import { authorizeRequest } from '@middlewares/jwt';

const departmentPutRequest = Router();

departmentPutRequest.put(
  '/update/:departmentId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = updateDepartmentRequestSchema.parse({
        ...req.params,
        ...req.body,
        ...req.headers,
      });

      const { departmentId, authorization, ...updateBody } = requestBody;

      const updatedData = await updateDepartmentDataByDepartmentId(
        departmentId,
        updateBody
      );

      return JsonApiResponse(
        res,
        updatedData.message,
        updatedData.success as boolean,
        null,
        updatedData?.success ? 200 : 400
      );
    } catch (error) {
      next(error);
    }
  }
);
export default departmentPutRequest;
