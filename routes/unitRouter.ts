import express = require('express');
import { verifyUserPermission } from '../lib/auth';
import { JsonResponse } from '../util/responses';
import { createNewUnit } from '../datastore/unitStore';
import { createUnitDataProps } from '../typeorm/objectsTypes/unitObjectTypes';

const unitRouter = express.Router();

unitRouter.post('/create', async (req, res) => {
  let message = 'Not Authorised',
    success = false;

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'SITE_ADMIN']
    );

    if (!verifiedUser) return JsonResponse(res, message, success, null, 401);

    const unitRes = await createNewUnit(req.body as createUnitDataProps);

    return JsonResponse(res, unitRes.message, unitRes.success, null, 200);
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonResponse(res, message, success, null, 403);
  }
});

export default unitRouter;
