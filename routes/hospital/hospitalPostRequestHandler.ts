import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { createNewHospital } from '@datastore/hospital/hospitalPostStore';
import {
  createHospitalRequestSchema,
  searchHospitalRequestSchema,
} from '../../schemas/hospitalSchemas';
import { authorizeRequest } from '@middlewares/jwt';
import { getSearchHospitalData } from '@datastore/hospital/hospitalGetStore';

const hospitalPostRequest = Router();

// Create Hospital
hospitalPostRequest.post(
  '/create',
  authorizeRequest(['SUPER_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = createHospitalRequestSchema.parse(req.body);

      const hospital = await createNewHospital(requestBody);

      return JsonApiResponse(
        res,
        hospital.message,
        !!hospital,
        null,
        hospital ? 201 : 400
      );
    } catch (error) {
      next(error);
    }
  }
);

hospitalPostRequest.post(
  '/search',
  authorizeRequest(['SUPER_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const responseBody = searchHospitalRequestSchema.parse(req.body);

      const hospitalData = await getSearchHospitalData(responseBody);

      return JsonApiResponse(
        res,
        'Success',
        true,
        {
          hospitals: hospitalData[0],
          totalRows: hospitalData[1],
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

export default hospitalPostRequest;
