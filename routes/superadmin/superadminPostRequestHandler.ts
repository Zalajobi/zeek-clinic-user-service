import { Router } from 'express';
import { getSuperAdminLoginData } from '@datastore/superadminStore';
import { generateJSONTokenCredentials, validatePassword } from '@helpers/utils';
import { JsonApiResponse } from '@util/responses';

const superadminPostRequest = Router();

superadminPostRequest.post('/auth/login', async (req, res) => {
  let responseMessage = 'Incorrect Credentials',
    jwtSignData = null,
    success = false;

  try {
    const admin = await getSuperAdminLoginData(req.body.email);

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

    return JsonApiResponse(
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

    return JsonApiResponse(res, message, success, null, 403);
  }
});

export default superadminPostRequest;
