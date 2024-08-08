import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import {
  selectAllAvailableCountries,
  fetchFilteredHospitalData,
  getHospitalDetailsById,
} from '@datastore/hospital/hospitalGetStore';
import {
  getOrganisationHospitalsFilterRequestSchema,
  hospitalDetailsRequestSchema,
} from '../../schemas/hospitalSchemas';
import { authorizeRequest } from '@middlewares/jwt';

const hospitalGetRequest = Router();

// Get Hospitel Data and apply filters for table
// https://winter-meadow-170239.postman.co/workspace/Zeek-Clinic~4c6a2e42-dfd1-40d9-a781-84902ac84071/request/6089823-93216433-fd31-4743-87d4-f0262b122825?active-environment=c506b532-0a33-49bd-abdb-a162a8e72932
hospitalGetRequest.get(
  '/organization/hospitals/filters',
  authorizeRequest(['SUPER_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = getOrganisationHospitalsFilterRequestSchema.parse(
        req.query
      );

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
  authorizeRequest(['SUPER_ADMIN']),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const distinctHospitals = await selectAllAvailableCountries();

      if (!distinctHospitals)
        return JsonApiResponse(res, 'Something went wrong', false, null, 401);
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
  authorizeRequest(['SUPER_ADMIN', 'HOSPITAL_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = hospitalDetailsRequestSchema.parse(req.params);

      const hospitalData = await getHospitalDetailsById(requestBody.id);

      return JsonApiResponse(
        res,
        hospitalData.message,
        true,
        hospitalData.data,
        hospitalData ? 200 : 400
      );
    } catch (error) {
      next(error);
    }
  }
);

export default hospitalGetRequest;
