import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { createNewHospital } from '@datastore/hospital/hospitalPostStore';
import { createHospitalRequestSchema } from '@lib/schemas/hospitalSchemas';
import { authorizeRequest } from '@middlewares/jwt';

const hospitalPostRequest = Router();

// Create Hospital
// https://winter-meadow-170239.postman.co/workspace/Zeek-Clinic~4c6a2e42-dfd1-40d9-a781-84902ac84071/request/6089823-31b8aa51-4c6f-497c-8714-7d0fd25f0347?active-environment=c506b532-0a33-49bd-abdb-a162a8e72932
hospitalPostRequest.post(
  '/create',
  authorizeRequest(['SUPER_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised';

    try {
      const requestBody = createHospitalRequestSchema.parse({
        ...req.body,
        ...req?.headers,
      });

      const hospital = await createNewHospital(requestBody);

      if (!hospital) {
        return JsonApiResponse(
          res,
          'Email Or Phone Number Already Exists',
          false,
          null,
          200
        );
      }

      return JsonApiResponse(res, 'New Organization Added', true, null, 200);
    } catch (error) {
      next(error);
    }
  }
);

export default hospitalPostRequest;
