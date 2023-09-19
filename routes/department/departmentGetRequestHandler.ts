import { Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { verifyUserPermission } from '@lib/auth';
import { getDepartmentDataBySiteId } from '@datastore/departmentStore';

const departmentGetRequest = Router();

departmentGetRequest.get('/get-all/:siteId', async (req, res) => {
  const siteId = req.params.siteId as string;
  let message = 'Not Authorised',
    success = false;

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'SITE_ADMIN', 'HUMAN_RESOURCES']
    );

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 200);

    const departments = await getDepartmentDataBySiteId(siteId);

    return JsonApiResponse(res, 'Success', true, departments, 200);
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 401);
  }
});

export default departmentGetRequest;
