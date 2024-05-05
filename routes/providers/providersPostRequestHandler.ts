import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import {
  generateTemporaryPassCode,
  generatePasswordHash,
} from '@helpers/utils';
import { emitNewEvent } from '@messaging/rabbitMq';
import { CREATE_ADMIN_QUEUE_NAME } from '@util/config';
import { adminCreateNewProvider } from '@datastore/provider/providerPostStore';
import { createProviderRequestSchema } from '@lib/schemas/providerSchemas';
import { remapObjectKeys } from '@util/index';

const providersPostRequestHandler = Router();

// Create New Provider
providersPostRequestHandler.post(
  '/create',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;
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
      const requestBody = createProviderRequestSchema.parse({
        ...req.headers,
        ...req.body,
      });

      const verifiedUser = verifyUserPermission(
        requestBody.authorization,
        [
          'SUPER_ADMIN',
          'HOSPITAL_ADMIN',
          'SITE_ADMIN',
          'ADMIN',
          'HUMAN_RESOURCES',
        ] // Remove HUMAN_RESOURCES later, this is for testing purpose for July 23, 2023 session 8AM - 2PM
      );

      if (!verifiedUser) {
        return JsonApiResponse(res, message, success, null, 200);
      }

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

      if (newAdmin.success as boolean) {
        await emitNewEvent(CREATE_ADMIN_QUEUE_NAME, {
          email: providerData?.email,
          firstName: personalInfoData.first_name,
          lastName: personalInfoData.last_name,
          tempPassword: tempPassword,
          userName: providerData.username,
        });
      }

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
