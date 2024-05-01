import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { adminCreateSite } from '@datastore/site/sitePostStore';
import {
  createSiteRequestSchema,
  searchSiteRequestSchema,
} from '@lib/schemas/siteSchemas';
import { authorizeRequest } from '@middlewares/jwt';
import { getSearchSiteData } from '@datastore/site/siteGetStore';

const sitePostRequest = Router();

/**
 * Creates or updates site information in the database. This endpoint accepts a comprehensive
 * set of site attributes including location details, contact information, operational flags,
 * and more. The input is validated against a stringent schema to ensure data integrity.
 * Additional checks ensure the email does not contain a '+' symbol.
 *
 * @route POST /site
 * @param {object} siteData - An object containing all site attributes as per the defined schema.
 *                            Fields include zip code, country, state, city, address, phone,
 *                            name (min 4 chars), email (valid email format), and various boolean
 *                            flags indicating the availability of different services at the site.
 *                            `hospital_id` and `totalSites` are required.
 *                            Optional fields include `logo`, `country_code`, and `time_zone`.
 * @returns {JSON} A JSON response indicating the success or failure of the operation.
 *                 Successful requests return the created or updated site information,
 *                 while failures return an error message and corresponding status code.
 */
sitePostRequest.post(
  '/create',
  authorizeRequest(['SUPER_ADMIN', 'HOSPITAL_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = createSiteRequestSchema.parse({
        ...req.headers,
        ...req.body,
      });

      const site = await adminCreateSite(requestBody);

      return JsonApiResponse(
        res,
        site?.message as string,
        site?.success as boolean,
        null,
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

sitePostRequest.post(
  '/search',
  authorizeRequest(['SITE_ADMIN', 'HOSPITAL_ADMIN', 'SUPER_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = searchSiteRequestSchema.parse({
        ...req.headers,
        ...req.body,
      });

      const queryData = await getSearchSiteData(requestBody);

      return JsonApiResponse(res, 'Success', true, queryData, 200);
    } catch (error) {
      next(error);
    }
  }
);

export default sitePostRequest;
