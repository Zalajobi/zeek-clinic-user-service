import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { adminCreateSite } from '@datastore/site/sitePostStore';
import { createSiteRequestSchema } from '@lib/schemas/siteSchemas';

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
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = createSiteRequestSchema.parse({
        ...req.headers,
        ...req.body,
      });

      const verifiedUser = verifyUserPermission(requestBody.token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

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

export default sitePostRequest;
