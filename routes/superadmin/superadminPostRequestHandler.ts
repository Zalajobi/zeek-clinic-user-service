import { Router } from 'express';
import { getSuperadminLoginData } from '../../datastore/superadminStore';
import {
  generateJSONTokenCredentials,
  validatePassword,
} from '../../helpers/utils';
import { JsonResponse } from '../../util/responses';
import superadminRouter from './index';

const superadminPostRequest = Router();

superadminPostRequest.post('/auth/login', async (req, res) => {
  let responseMessage = 'Incorrect Credentials',
    jwtSignData = null,
    success = false;

  try {
    const admin = await getSuperadminLoginData(req.body.email);

    if (validatePassword(req.body.password, admin?.password ?? '')) {
      const jwtData = {
        id: admin?.id as string,
        email: admin?.email as string,
        role: admin?.role as string,
      };

      jwtSignData = generateJSONTokenCredentials(
        jwtData,
        Math.floor(Date.now() / 1000) + 60 * 360
      );
      responseMessage = 'Login Successful';
      success = true;
    }

    return JsonResponse(
      res,
      responseMessage,
      success,
      {
        token: jwtSignData,
      },
      200
    );
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonResponse(res, message, success, null, 403);
  }
});

export default superadminPostRequest;
