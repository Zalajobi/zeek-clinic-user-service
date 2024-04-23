import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import {
  adminGetProviderDetails,
  fetchFilteredProviderData,
} from '@datastore/provider/providerGetStore';
import {
  getOrganisationProvidersFilterRequestSchema,
  getProviderDetailsRequestSchema,
} from '@lib/schemas/providerSchemas';

const providersGetRequestHandler = Router();

// Admin get the list of provider of a site by site ID - Paginated Data
providersGetRequestHandler.get(
  `/organization/providers/filters`,
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = getOrganisationProvidersFilterRequestSchema.parse({
        ...req.headers,
        ...req.query,
      });

      const verifiedUser = await verifyUserPermission(requestBody.token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

      const providersData = await fetchFilteredProviderData(
        requestBody.page,
        requestBody.per_page,
        requestBody.search,
        requestBody.from_date,
        requestBody.to_date,
        requestBody.country,
        requestBody.status,
        requestBody.siteId
      );

      if (providersData.success)
        return JsonApiResponse(
          res,
          providersData.message,
          providersData.success,
          {
            providers: providersData.data[0],
            count: providersData.data[1],
          },
          200
        );

      return JsonApiResponse(res, 'Something went wrong', success, null, 401);
    } catch (error) {
      next(error);
    }
  }
);

// Get provider details
providersGetRequestHandler.get(
  `/details/:id`,
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = getProviderDetailsRequestSchema.parse({
        ...req.params,
        ...req.headers,
      });

      const verifiedUser = await verifyUserPermission(requestBody.token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

      const provider = await adminGetProviderDetails(requestBody.id);

      if (provider.success) {
        return JsonApiResponse(
          res,
          provider.message,
          provider.success,
          provider.data,
          200
        );
      }

      return JsonApiResponse(res, 'Something went wrong', success, null, 401);
    } catch (error) {
      next(error);
    }
  }
);

export default providersGetRequestHandler;
