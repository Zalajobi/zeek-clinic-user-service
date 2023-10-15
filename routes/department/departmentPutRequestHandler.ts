import { Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { updateDepartmentData } from '@datastore/departmentStore';

const departmentPutRequest = Router();

departmentPutRequest.put('/admin/update/:departmentId', async (req, res) => {
  const departmentId = req.params.departmentId as string;
  let message = 'Not Authorised',
    success = false;

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]
    );

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 401);

    const updatedData = await updateDepartmentData(departmentId, req.body);

    return JsonApiResponse(
      res,
      updatedData.message,
      updatedData.success as boolean,
      null,
      updatedData?.success ? 200 : 400
    );
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 500);
  }
});
export default departmentPutRequest;
