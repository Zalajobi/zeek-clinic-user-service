import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { adminCreateNewProvider } from '@datastore/provider/providerPostStore';
import { createProviderRequestSchema } from '@lib/schemas/providerSchemas';
import {
  generatePasswordHash,
  generateTemporaryPassCode,
  remapObjectKeys,
} from '@util/index';
import { authorizeRequest } from '@middlewares/jwt';

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
    const providerKeys = [
        'appointments',
        'department',
        'is_consultant',
        'is_specialist',
        'role',
        'serviceArea',
        'siteId',
        'staff_id',
        'unit',
        'username',
        'email',
        'password',
      ],
      personalInfoKeys = [
        'address',
        'city',
        'country',
        'country_code',
        'dob',
        'first_name',
        'gender',
        'last_name',
        'middle_name',
        'state',
        'title',
        'zip_code',
        'marital_status',
        'phone',
        'profile_pic',
        'religion',
      ];

    try {
      const requestBody = createProviderRequestSchema.parse(req.body);

      const tempPassword = generateTemporaryPassCode();
      requestBody.password = generatePasswordHash(tempPassword);
      requestBody.username = requestBody.username ?? requestBody.staff_id;

      const providerData = remapObjectKeys(requestBody, providerKeys);
      const personalInfoData = remapObjectKeys(requestBody, personalInfoKeys);

      const newAdmin = await adminCreateNewProvider(
        providerData,
        personalInfoData,
        requestBody.phone
      );

      // if (newAdmin.success as boolean) {
      //   await emitNewEvent(CREATE_ADMIN_QUEUE_NAME, {
      //     email: providerData?.email,
      //     firstName: personalInfoData.first_name,
      //     lastName: personalInfoData.last_name,
      //     tempPassword: tempPassword,
      //     userName: providerData.username,
      //   });
      // }

      return JsonApiResponse(
        res,
        <string>newAdmin?.message,
        <boolean>newAdmin?.success,
        null,
        201
      );
    } catch (error) {
      next(error);
    }
  }
);

export default providersPostRequestHandler;
