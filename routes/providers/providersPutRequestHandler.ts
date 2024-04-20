import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { verifyUserPermission } from '@lib/auth';
import { generatePasswordHash } from '@helpers/utils';
import { remapObjectKeys } from '@util/index';
import { updateProviderDetails } from '@datastore/provider/providerPutStore';
import { updateProviderRequestSchema } from '@lib/schemas/providerSchemas';

const providersPutRequestHandler = Router();

providersPutRequestHandler.put(
  '/update/:id/:site',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    const providerKeys = [
        'appointments',
        'email',
        'is_consultant',
        'is_specialist',
        'password',
        'staff_id',
        'username',
        'departmentId',
        'primaryRoleId',
        'serviceareaId',
        'siteId',
        'unitId',
      ],
      personalInfoKeys = [
        'address',
        'address_two',
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
      const requestBody = updateProviderRequestSchema.parse({
        ...req.headers,
        ...req.params,
        ...req.body,
      });

      const verifiedUser = await verifyUserPermission(
        requestBody.token,
        [
          'SUPER_ADMIN',
          'HOSPITAL_ADMIN',
          'SITE_ADMIN',
          'ADMIN',
          'HUMAN_RESOURCES',
        ] // Remove HUMAN_RESOURCES later, this is for testing purpose for July 23, 2023 session 8AM - 2PM
      );

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

      if (requestBody?.password) {
        requestBody.password = generatePasswordHash(requestBody.password);
      }

      const providerData = remapObjectKeys(requestBody, providerKeys);
      const personalInfoData = remapObjectKeys(requestBody, personalInfoKeys);

      const updateProviderResponse = await updateProviderDetails(
        requestBody.id,
        requestBody.site,
        providerData,
        personalInfoData
      );

      return JsonApiResponse(
        res,
        updateProviderResponse.message,
        <boolean>updateProviderResponse.success,
        null,
        updateProviderResponse.success ? 201 : 500
      );
    } catch (error) {
      next(error);
    }
  }
);

export default providersPutRequestHandler;
