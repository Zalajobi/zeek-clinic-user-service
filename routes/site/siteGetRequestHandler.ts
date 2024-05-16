import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { getServiceAreaDataBySiteId } from '@datastore/serviceArea/serviceAreaGetStore';
import { getDepartmentDataBySiteId } from '@datastore/department/departmentGetStore';
import { getRoleDataBySiteId } from '@datastore/role/roleGetStore';
import {
  getHospitalGeoDetails,
  loadSiteDetailsById,
  fetchFilteredSiteData,
  getSiteStatusCountsByHospitalId,
} from '@datastore/site/siteGetStore';
import { getUnitDataBySiteID } from '@datastore/unit/unitGetStore';
import {
  getHospitalGeoDetailsRequestSchema,
  getOrganisationSiteFilterRequestSchema,
  getSiteDetailsRequestSchema,
  getSitesOrganizationalStructuresRequestSchema,
  siteStatusCountsRequestSchema,
} from '@lib/schemas/siteSchemas';
import { authorizeRequest } from '@middlewares/jwt';

const siteGetRequest = Router();

/**
 * Retrieves detailed information for a specific site based on a hospital or site ID.
 * This endpoint is designed to provide comprehensive details about a site, such as
 * location, services offered, and operational status. The current implementation
 * expects to fetch data based on a hospitalId, but the route does not currently
 * parse this ID from the request. This needs to be updated to either include a
 * route parameter or a query string to properly function.
 *
 * @route GET /get-information
 * @param {string} hospitalId - The unique identifier of the hospital or site to retrieve information from.
 * @returns {Object} A response object containing the site details or an error message in case of failure.
 */
siteGetRequest.get(
  '/get-information',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const siteData = await getSiteInformation(req.params.hospitalId as string)
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Fetches unique countries and states for sites linked to a specific hospital ID.
 * @param hospitalId The hospital's unique identifier.
 * @param token Authorization token required for access.
 * @returns An object with arrays of distinct countries and states.
 */
siteGetRequest.get(
  '/:hospitalId/locations/distinct',
  authorizeRequest(['SUPER_ADMIN', 'HOSPITAL_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = getHospitalGeoDetailsRequestSchema.parse({
        ...req.headers,
        ...req.params,
      });

      const data = await getHospitalGeoDetails(requestBody.hospitalId);
      return JsonApiResponse(res, 'Success', true, data, 200);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Retrieves filtered site data for an organization within an account context, supporting advanced
 * filtering options such as date ranges, search terms, and location. This endpoint requires an
 * authorization token and supports pagination.
 * @param token The authorization token required for validating user permissions.
 * @param hospital_id Identifier for the hospital associated with the sites being queried.
 * @param page Page number for pagination of the site data.
 * @param per_page Number of site records per page.
 * @param from_date Start date for filtering site data.
 * @param to_date End date for filtering site data.
 * @param search Search term for filtering sites.
 * @param country Country filter for the sites.
 * @param status Operational status filter for the sites.
 * @param state State filter for the sites.
 * @returns Paginated and filtered data specific to site details for a given organization.
 */
siteGetRequest.get(
  '/organization/sites/filters',
  authorizeRequest(['SUPER_ADMIN', 'HOSPITAL_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = getOrganisationSiteFilterRequestSchema.parse({
        ...req.query,
        ...req.headers,
      });

      const data = await fetchFilteredSiteData(
        requestBody.page,
        requestBody.per_page,
        requestBody?.search,
        requestBody?.from_date,
        requestBody?.to_date,
        requestBody?.country,
        requestBody?.status,
        requestBody?.state,
        requestBody.hospital_id
      );

      return JsonApiResponse(res, 'Success', true, data, 200);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Retrieves detailed information about a specific site identified by its unique site ID.
 * This endpoint is designed to provide comprehensive details about the site, including
 * its operational data, location, and other relevant attributes. The information is
 * primarily intended for display in user interfaces or for administrative purposes.
 *
 * @route GET /account/site/:siteId/details
 * @param {string} siteId - The unique identifier of the site. This ID is required to
 *                          fetch specific site details and must be provided in the URL.
 * @returns {Object} A JSON response containing a success status, a message, and the
 *                   detailed site data if successful. If an error occurs, it returns a
 *                   response with a failure status and the error message.
 */
siteGetRequest.get(
  '/details/:siteId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = getSiteDetailsRequestSchema.parse({
        ...req.params,
        ...req.headers,
      });

      const site = await loadSiteDetailsById(requestBody.siteId);
      return JsonApiResponse(
        res,
        site ? 'Site Info Request Success' : 'Something Went Wrong',
        !!site,
        site,
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Retrieves detailed organizational structure data (departments, roles, service areas, and units)
 * for a specified site. This endpoint requires authorization and is intended for users with specific
 * administrative roles within the hospital.
 *
 * @route GET /account/site/:siteId/organizational-structures
 * @param siteId The unique identifier of the site for which organizational data is requested.
 * @header token Authorization token required to validate user permissions. Must be provided in the request headers.
 * @returns A JSON response containing the organizational data if the user is authorized, or an error message if not authorized or in case of an error.
 */
siteGetRequest.get(
  '/:siteId/organizational-structures',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = getSitesOrganizationalStructuresRequestSchema.parse({
        ...req.headers,
        ...req.params,
      });

      const [department, role, serviceArea, unit] = await Promise.all([
        getDepartmentDataBySiteId(requestBody.siteId),

        getRoleDataBySiteId(requestBody.siteId),

        getServiceAreaDataBySiteId(requestBody.siteId),

        getUnitDataBySiteID(requestBody.siteId),
      ]);

      return JsonApiResponse(
        res,
        'Success',
        true,
        {
          department,
          role,
          serviceArea,
          unit,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

siteGetRequest.get(
  '/status-counts/organization/:hospitalId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = siteStatusCountsRequestSchema.parse(req.params);

      const data = await getSiteStatusCountsByHospitalId(
        requestBody.hospitalId
      );
      return JsonApiResponse(res, 'Success', true, data, 200);
    } catch (error) {
      next(error);
    }
  }
);

export default siteGetRequest;
