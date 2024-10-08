import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { updateDepartmentDataByDepartmentId } from '@datastore/department/departmentPutStore';
import { updateDepartmentRequestSchema } from '../../schemas/departmentSchemas';
import { authorizeRequest } from '@middlewares/auth';

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
      });

      const { departmentId, ...updateBody } = requestBody;

      const updatedData = await updateDepartmentDataByDepartmentId(
        departmentId,
        updateBody
      );

      return JsonApiResponse(
        res,
        updatedData.message,
        updatedData.success,
        null,
        updatedData?.success ? 200 : 400
      );
    } catch (error) {
      next(error);
    }
  }
);
export default departmentPutRequest;
