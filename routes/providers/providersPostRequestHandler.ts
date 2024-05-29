import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { createNewProvider } from '@datastore/provider/providerPostStore';
import {
  createProviderRequestSchema,
  searchProviderRequestSchema,
} from '@lib/schemas/providerSchemas';
import { generatePasswordHash, generateTemporaryPassCode } from '@util/index';
import { authorizeRequest } from '@middlewares/jwt';
import { getSearchProviderData } from '@datastore/provider/providerGetStore';

const providersPostRequestHandler = Router();

// Create New Provider
providersPostRequestHandler.post(
  '/create',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = createProviderRequestSchema.parse(req.body);

      // Set a temporary password if no password is set
      const tempPassword = generateTemporaryPassCode();
      requestBody.password = generatePasswordHash(
        requestBody?.password ?? tempPassword
      );

      const { message, success } = await createNewProvider(requestBody);

      // if (newAdmin.success as boolean) {
      //   await emitNewEvent(CREATE_ADMIN_QUEUE_NAME, {
      //     email: providerData?.email,
      //     firstName: personalInfoData.first_name,
      //     lastName: personalInfoData.last_name,
      //     tempPassword: tempPassword,
      //     userName: providerData.username,
      //   });
      // }

      return JsonApiResponse(res, message, success, null, success ? 201 : 400);
    } catch (error) {
      next(error);
    }
  }
);

providersPostRequestHandler.post(
  '/search',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = searchProviderRequestSchema.parse(req.body);

      const { data, success, message } = await getSearchProviderData(
        requestBody
      );
      return JsonApiResponse(
        res,
        message,
        success,
        {
          providers: data.provider,
          totalRows: data.totalRows,
        },
        200
      );
    } catch (err) {
      next(err);
    }
  }
);

export default providersPostRequestHandler;
