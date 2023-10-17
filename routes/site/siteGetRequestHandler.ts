import { Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { verifyUserPermission } from '@lib/auth';
import {
  getDistinctOrganizationSiteCountriesAndStates,
  getSiteInformationBySiteId,
  siteTableDatastore,
} from '@datastore/siteStore';
import { getDepartmentDataBySiteId } from '@datastore/departmentStore';
import { getRoleDataBySiteId } from '@datastore/roleStore';
import { getUnitDataBySiteID } from '@datastore/unitStore';
import { getServiceAreaDataBySiteId } from '@datastore/serviceArea/serviceAreaGetStore';

const siteGetRequest = Router();

siteGetRequest.get('/get-information', async (req, res) => {
  let message = 'Not Authorised',
    success = false;

  try {
    // const siteData = await getSiteInformation(req.params.hospitalId as string)
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 500);
  }
});

// Get All countries and States where an organization has a site. These countries and states are distinct
siteGetRequest.get(
  '/get-distinct/country-and-state/organization',
  async (req, res) => {
    let message = 'Not Authorised',
      success = false;
    try {
      const verifiedUser = await verifyUserPermission(
        req?.headers?.token as string,
        ['SUPER_ADMIN', 'HOSPITAL_ADMIN']
      );

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

      const data = await getDistinctOrganizationSiteCountriesAndStates(
        req.query.hospital_id as string
      );
      return JsonApiResponse(res, 'Success', true, data, 200);
    } catch (error) {
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, false, null, 401);
    }
  }
);

siteGetRequest.get('/organization/table-filter', async (req, res) => {
  let message = 'Not Authorised',
    success = false;
  const {
    page,
    per_page,
    from_date,
    to_date,
    search,
    country,
    status,
    state,
    hospital_id,
  } = req.query;

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN', 'HOSPITAL_ADMIN']
    );

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 401);

    const data = await siteTableDatastore(
      page as unknown as number,
      per_page as unknown as number,
      search as unknown as string,
      from_date as unknown as string,
      to_date as unknown as string,
      country as unknown as string,
      status as unknown as string,
      state as unknown as string,
      hospital_id as unknown as string
    );

    return JsonApiResponse(res, 'Success', true, data, 200);
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, false, null, 401);
  }
});

siteGetRequest.get('/admin/get/information/:siteId', async (req, res) => {
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

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 401);

    const site = await getSiteInformationBySiteId(siteId);

    return JsonApiResponse(
      res,
      site ? 'Site Info Request Success' : 'Something Went Wrong',
      !!site,
      site,
      200
    );
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 500);
  }
});

siteGetRequest.get(
  '/department-roles-service_area-unit/:siteId',
  async (req, res) => {
    let message = 'Not Authorised',
      success = false;

    const { siteId } = req.params;

    try {
      const verifiedUser = await verifyUserPermission(
        req?.headers?.token as string,
        ['HOSPITAL_ADMIN', 'SITE_ADMIN', 'HUMAN_RESOURCES']
      );

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

      const [department, role, serviceArea, unit] = await Promise.all([
        getDepartmentDataBySiteId(siteId),

        getRoleDataBySiteId(siteId),

        getServiceAreaDataBySiteId(siteId),

        getUnitDataBySiteID(siteId),
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
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, false, null, 401);
    }
  }
);

export default siteGetRequest;
