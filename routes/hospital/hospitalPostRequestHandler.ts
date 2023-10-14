import { Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { createNewHospital } from '@datastore/hospitalStore';
import { hospitalModelProps } from '../../types';

const hospitalPostRequest = Router();

hospitalPostRequest.post('/create', async (req, res) => {
  let message = 'Not Authorised';

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN']
    );

    if (!verifiedUser) return JsonApiResponse(res, message, false, null, 401);

    const hospital = await createNewHospital(req.body as hospitalModelProps);

    if (!hospital) {
      return JsonApiResponse(
        res,
        'Email Or Phone Number Already Exists',
        false,
        null,
        200
      );
    }

    return JsonApiResponse(res, 'New Organization Added', true, null, 200);
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, false, null, 403);
  }
});

export default hospitalPostRequest;
