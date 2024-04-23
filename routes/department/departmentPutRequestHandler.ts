import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { updateDepartmentDataByDepartmentId } from '@datastore/department/departmentPutStore';
import { updateDepartmentRequestSchema } from '@lib/schemas/departmentSchemas';

const departmentPutRequest = Router();

departmentPutRequest.put(
  '/update/:departmentId',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = updateDepartmentRequestSchema.parse({
        ...req.params,
        ...req.body,
        ...req.headers,
      });

      const { departmentId, token, ...updateBody } = requestBody;

      const verifiedUser = verifyUserPermission(token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

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
