import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { updatePatientDetails } from '@datastore/patient/patientPutStore';
import { updatePatientDetailsRequestSchema } from '@lib/schemas/patientSchemas';
import { getPatientCountByEmail } from '@datastore/patient/patientGetStore';
import { authorizeRequest } from '@middlewares/jwt';

const patientPutRequestHandler = Router();

patientPutRequestHandler.put(
  '/update/:id',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization, id, ...updateBody } =
        updatePatientDetailsRequestSchema.parse({
          ...req.body,
          ...req.headers,
          ...req.params,
        });

      if (updateBody.email) {
        const emailExists = await getPatientCountByEmail(updateBody.email);
        if (emailExists >= 1) {
          return JsonApiResponse(
            res,
            'Patient with Email Exists',
            false,
            null,
            400
          );
        }
      }

      const response = await updatePatientDetails(id, updateBody);

      return JsonApiResponse(
        res,
        response.message,
        response.success as boolean,
        null,
        response?.success ? 200 : 400
      );
    } catch (error) {
      next(error);
    }
  }
);
export default patientPutRequestHandler;
