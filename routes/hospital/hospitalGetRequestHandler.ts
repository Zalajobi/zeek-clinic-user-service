import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import {
  getHospitalDetails,
  selectAllAvailableCountries,
  fetchFilteredHospitalData,
} from '@datastore/hospital/hospitalGetStore';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';
import {
  getOrganisationHospitalsFilterRequestSchema,
  hospitalDetailsRequestSchema,
} from '@lib/schemas/hospitalSchemas';

const hospitalGetRequest = Router();

// Get Hospitel Data and apply filters for table
// https://winter-meadow-170239.postman.co/workspace/Zeek-Clinic~4c6a2e42-dfd1-40d9-a781-84902ac84071/request/6089823-93216433-fd31-4743-87d4-f0262b122825?active-environment=c506b532-0a33-49bd-abdb-a162a8e72932
hospitalGetRequest.get(
  '/organization/hospitals/filters',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;
    try {
      const requestBody = getOrganisationHospitalsFilterRequestSchema.parse({
        ...req.headers,
        ...req.query,
      });

      const verifiedUser = await verifyUserPermission(requestBody.token, [
        'SUPER_ADMIN',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

      const data = await fetchFilteredHospitalData(
        requestBody.page,
        requestBody.per_page,
        requestBody.search,
        requestBody.from_date,
        requestBody.to_date,
        requestBody.country,
        requestBody.status
      );

      return JsonApiResponse(res, 'Success', true, data, 200);
    } catch (error) {
      next(error);
    }
  }
);

hospitalGetRequest.get(
  '/distinct-countries',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = bearerTokenSchema.parse(req.headers);

      const verifiedUser = await verifyUserPermission(requestBody.token, [
        'SUPER_ADMIN',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

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
      next(error);
    }
  }
);

hospitalGetRequest.get(
  '/details/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = hospitalDetailsRequestSchema.parse({
        ...req.params,
        ...req.headers,
      });

      const verifiedUser = await verifyUserPermission(requestBody.token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

      const hospitalData = await getHospitalDetails(requestBody.id);

      if (!hospitalData)
        return JsonApiResponse(
          res,
          'Organization not found',
          success,
          null,
          400
        );

      return JsonApiResponse(res, 'Hospital data', true, hospitalData, 200);
    } catch (error) {
      next(error);
    }
  }
);

export default hospitalGetRequest;
