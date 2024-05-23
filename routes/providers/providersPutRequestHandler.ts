import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { generatePasswordHash, remapObjectKeys } from '@util/index';
import { updateProviderDetails } from '@datastore/provider/providerPutStore';
import { updateProviderRequestSchema } from '@lib/schemas/providerSchemas';
import { authorizeRequest } from '@middlewares/jwt';

const providersPutRequestHandler = Router();

providersPutRequestHandler.put(
  '/update/:id/:site',
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
        'zipCode',
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
