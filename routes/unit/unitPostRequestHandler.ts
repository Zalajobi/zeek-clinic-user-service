import { Router } from 'express';

import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { unitModelProps } from '@typeDesc/index';
import { createNewUnit } from '@datastore/unit/unitPostStore';

const unitPostRequest = Router();

// Create New Department
unitPostRequest.post('/admin/create', async (req, res) => {
  let message = 'Not Authorised',
    success = false;

  try {
    const data = req.body as unitModelProps;

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

    const newRole = await createNewUnit(data);

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

export default unitPostRequest;
