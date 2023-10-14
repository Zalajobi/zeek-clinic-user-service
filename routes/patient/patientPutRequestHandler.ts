import { Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { verifyUserPermission } from '@lib/auth';
import { movePatientWithinSite } from '@datastore/patientStore';

const patientPutRequestHandler = Router();

patientPutRequestHandler.put('/move/:id', async (req, res) => {
  let message = 'Not Authorised',
    success = false;

  const id = req.params.id;

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

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 403);

    const response = await movePatientWithinSite(req.params.id, req.body);

    return JsonApiResponse(
      res,
      response.message,
      response.success as boolean,
      null,
      response?.success ? 200 : 400
    );
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 500);
  }
});
export default patientPutRequestHandler;
