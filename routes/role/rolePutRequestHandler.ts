import { Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { updateRoleDataByRoleId } from '@datastore/role/rolePutStore';

const rolePutRequest = Router();

rolePutRequest.put('/admin/update/:roleId', async (req, res) => {
  const roleId = req.params.roleId as string;
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

    const updatedData = await updateRoleDataByRoleId(roleId, req.body);

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

export default rolePutRequest;
