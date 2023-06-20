import express = require('express');
import { JsonResponse } from '../util/responses';
import { verifyUserPermission } from '../lib/auth';
import { CreateServiceAreaDataProps } from '../typeorm/objectsTypes/serviceAreaObjectType';
import { createServiceArea } from '../datastore/serviceAreaStore';

const serviceAreaRouter = express.Router();

serviceAreaRouter.post('/create', async (req, res) => {
  let message = 'Not Authorised',
    success = false;

  try {
    const data = req.body as CreateServiceAreaDataProps;

    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'SITE_ADMIN']
    );

    if (!verifiedUser) return JsonResponse(res, message, success, null, 401);

    const serviceArea = await createServiceArea(data);

    return JsonResponse(
      res,
      serviceArea.message,
      serviceArea.success,
      null,
      200
    );
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonResponse(res, message, success, null, 403);
  }
});

export default serviceAreaRouter;
