import { Router } from 'express';
import { verifyUserPermission } from '../../lib/auth';
import { JsonApiResponse } from '../../util/responses';
import { adminCreateSite } from '../../datastore/siteStore';
import { siteModelProps } from '../../typeorm/objectsTypes/siteObjectTypes';

const sitePostRequest = Router();

sitePostRequest.post('/create', async (req, res) => {
  let message = 'Not Authorised',
    success = false;

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN', 'HOSPITAL_ADMIN']
    );

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 401);

    const site = await adminCreateSite(req.body as siteModelProps);

    return JsonApiResponse(
      res,
      site?.message as string,
      site?.success as boolean,
      null,
      200
    );
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 403);
  }
});

export default sitePostRequest;
