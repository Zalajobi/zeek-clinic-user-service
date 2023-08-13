import { Router } from 'express';
import { verifyUserPermission } from '../../lib/auth';
import { JsonApiResponse } from '../../util/responses';
import { getSiteInformationBySiteId } from '../../datastore/siteStore';
import { adminGetProvidersInfoPagination } from '../../datastore/providerStore';

const providersGetRequestHandler = Router();

providersGetRequestHandler.get(
  `/admin/get-providers/pagination/:siteId`,
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

      const { page, per_page, from_date, to_date, search, country, status } =
        req.query;

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 403);

      const providersData = await adminGetProvidersInfoPagination(
        page as unknown as number,
        per_page as unknown as number,
        search as unknown as string,
        from_date as unknown as string,
        to_date as unknown as string,
        country as unknown as string,
        status as unknown as string,
        siteId as string
      );

      if (providersData.success)
        return JsonApiResponse(
          res,
          providersData.message,
          providersData.success,
          providersData.data,
          200
        );

      return JsonApiResponse(res, 'Something went wrong', success, null, 403);
    } catch (error) {
      let message = 'Not Authorized';
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, success, null, 403);
    }
  }
);

export default providersGetRequestHandler;
