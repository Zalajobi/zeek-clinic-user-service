import { Router } from 'express';
import { verifyUserPermission } from '../../lib/auth';
import { JsonApiResponse } from '../../util/responses';
import { adminGetAllProvidersData } from '../../datastore/providerStore';
import { ProviderListResponseData } from '../../typeorm/objectsTypes/providersObjectTypes';
import { siteModelProps } from '../../typeorm/objectsTypes/siteObjectTypes';

const providersGetRequestHandler = Router();

providersGetRequestHandler.get(
  '/site/providers/get/:siteId',
  async (req, res) => {
    let message = 'Not Authorised',
      success = false;

    const { siteId } = req.params;

    try {
      const verifiedUser = await verifyUserPermission(
        req?.headers?.token as string,
        [
          'SUPER_ADMIN',
          'HOSPITAL_ADMIN',
          'SITE_ADMIN',
          'ADMIN',
          'HUMAN_RESOURCES',
        ]
      );

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 403);

      const [site, providers] = await adminGetAllProvidersData(siteId);

      return JsonApiResponse(
        res,
        message,
        true,
        {
          providers,
          site,
        },
        200
      );
    } catch (error) {
      let message = 'Not Authorized';
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, success, null, 403);
    }
  }
);

export default providersGetRequestHandler;
