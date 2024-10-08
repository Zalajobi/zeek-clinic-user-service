import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import {
  adminGetProviderDetails,
  fetchFilteredProviderData,
  getProviderCountBySiteId,
  retrieveProviderDistributionForSite,
} from '@datastore/provider/providerGetStore';
import { getOrganisationProvidersFilterRequestSchema } from '../../schemas/providerSchemas';
import { authorizeRequest } from '@middlewares/auth';
import {
  getDistributionRequestSchema,
  idRequestSchema,
  siteIdRequestSchema,
} from '../../schemas/commonSchemas';

const providersGetRequestHandler = Router();

// Admin get the list of provider of a site by site ID - Paginated Data
providersGetRequestHandler.get(
  `/organization/providers/filters`,
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = getOrganisationProvidersFilterRequestSchema.parse(
        req.query
      );

      const providerData = await fetchFilteredProviderData(
        requestBody.page,
        requestBody.per_page,
        requestBody.search,
        requestBody.from_date,
        requestBody.to_date,
        requestBody.country,
        requestBody.status,
        requestBody.siteId
      );

      if (providerData.success)
        return JsonApiResponse(
          res,
          providerData.message,
          providerData.success,
          {
            providers: providerData.data[0],
            count: providerData.data[1],
          },
          200
        );

      return JsonApiResponse(res, 'Something went wrong', false, null, 401);
    } catch (error) {
      next(error);
    }
  }
);

// Get provider details
providersGetRequestHandler.get(
  `/:id`,
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = idRequestSchema.parse(req.params);

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

      return JsonApiResponse(res, 'Something went wrong', false, null, 401);
    } catch (error) {
      next(error);
    }
  }
);

// Get Provider Count by SiteId
providersGetRequestHandler.get(
  '/count/:siteId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { siteId } = siteIdRequestSchema.parse(req.params);

    try {
      const count = await getProviderCountBySiteId(siteId);

      return JsonApiResponse(
        res,
        'Success',
        true,
        {
          totalRows: count,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

providersGetRequestHandler.get(
  '/distribution/:type/:siteId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { siteId, type } = getDistributionRequestSchema.parse(req.params);

    try {
      const { data, success, message } =
        await retrieveProviderDistributionForSite(siteId, type);

      return JsonApiResponse(res, message, success, data, 200);
    } catch (error) {
      next(error);
    }
  }
);

export default providersGetRequestHandler;
