import express = require('express');
import { JsonResponse } from '../util/responses';
import { departmentModelProps, roleModelProps } from '../types';
import { verifyUserPermission } from '../lib/auth';
import { createNewDepartment } from '../datastore/departmentStore';

const departmentRouter = express.Router();

departmentRouter.post('/create', async (req, res) => {
  let message = 'Not Authorised',
    success = false;

  try {
    const data = req.body as departmentModelProps;

    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'SITE_ADMIN']
    );

    if (!verifiedUser) return JsonResponse(res, message, success, null, 401);

    const newRole = await createNewDepartment(data);

    return JsonResponse(res, newRole.message, newRole.success, null, 200);
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonResponse(res, message, success, null, 403);
  }
});

export default departmentRouter;
