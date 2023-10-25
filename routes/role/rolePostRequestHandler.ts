import { Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { createNewRole } from '@datastore/role/rolePostStore';
import { roleModelProps } from '@typeDesc/index';

const rolePostRequest = Router();

rolePostRequest.post('/admin/create', async (req, res) => {
  let message = 'Not Authorised',
    success = false;

  try {
    const data = req.body as roleModelProps;

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

    const newRole = await createNewRole(data);

    return JsonApiResponse(
      res,
      newRole.message,
      <boolean>newRole.success,
      null,
      newRole?.success ? 201 : 500
    );
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 500);
  }
});

export default rolePostRequest;
