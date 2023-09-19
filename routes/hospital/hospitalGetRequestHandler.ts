import { Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import {
  getHospitalDetails,
  selectAllAvailableCountries,
  superAdminGetHospitals,
} from '@datastore/hospitalStore';
import hospitalRouter from './index';

const hospitalGetRequest = Router();

hospitalGetRequest.get('/super-admin/get/all/pagination', async (req, res) => {
  let message = 'Not Authorised',
    success = false;
  const { page, per_page, from_date, to_date, search, country, status } =
    req.query;

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN']
    );

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 401);

    const data = await superAdminGetHospitals(
      page as unknown as number,
      per_page as unknown as number,
      search as unknown as string,
      from_date as unknown as string,
      to_date as unknown as string,
      country as unknown as string,
      status as any
    );

    return JsonApiResponse(res, 'Success', true, data, 200);
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, false, null, 401);
  }
});

hospitalGetRequest.get('/super-admin/countries/distinct', async (req, res) => {
  let message = 'Not Authorised',
    success = false;

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN']
    );

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 401);

    const distinctHospitals = await selectAllAvailableCountries();

    if (!distinctHospitals)
      return JsonApiResponse(res, 'Something went wrong', success, null, 401);
    else
      return JsonApiResponse(
        res,
        'Get Distinct Success',
        true,
        distinctHospitals,
        200
      );
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 401);
  }
});

hospitalGetRequest.get('/details', async (req, res) => {
  let message = 'Not Authorised',
    success = false;

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN', 'HOSPITAL_ADMIN']
    );

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 403);

    const hospitalData = await getHospitalDetails(req.query.id as string);

    if (!hospitalData)
      return JsonApiResponse(res, 'Organization not found', success, null, 400);

    return JsonApiResponse(res, 'Hospital data', true, hospitalData, 200);
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 403);
  }
});

export default hospitalGetRequest;
