import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { verifyUserPermission } from '@lib/auth';
import { updatePatientDetails } from '@datastore/patient/patientPutStore';
import { updatePatientDetailsRequestSchema } from '@lib/schemas/patientSchemas';
import { getPatientCountByEmail } from '@datastore/patient/patientGetStore';

const patientPutRequestHandler = Router();

patientPutRequestHandler.put(
  '/update/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const { token, id, ...updateBody } =
        updatePatientDetailsRequestSchema.parse({
          ...req.body,
          ...req.headers,
          ...req.params,
        });

      const verifiedUser = verifyUserPermission(token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

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
