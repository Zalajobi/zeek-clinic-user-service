import { Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { createServiceArea } from '@datastore/serviceArea/serviceAreaPostStore';
import { CreateServiceAreaDataProps } from '@typeorm/objectsTypes/serviceAreaObjectType';

const serviceAreaPostRequest = Router();

serviceAreaPostRequest.post('/admin/create', async (req, res) => {
  let message = 'Not Authorised',
    success = false;

  try {
    const data = req.body as CreateServiceAreaDataProps;

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

    const newRole = await createServiceArea(data);

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

export default serviceAreaPostRequest;
