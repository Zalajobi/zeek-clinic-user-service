import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { verifyUserPermission } from '@lib/auth';
import { getCareGiverPrimaryPatients } from '@datastore/patient/patientGetStore';
import { getProviderPrimaryPatientRequestSchema } from '@lib/schemas/patientSchemas';

const patientGetRequestHandler = Router();

// Get the list of providers' primary patients - no pagination
patientGetRequestHandler.get(
  '/care-giver/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const { token, id } = getProviderPrimaryPatientRequestSchema.parse({
        ...req.params,
        ...req.headers,
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

      const patientData = await getCareGiverPrimaryPatients(id);

      return JsonApiResponse(
        res,
        patientData.message,
        patientData.success as boolean,
        patientData?.data,
        patientData.data ? 200 : 400
      );
    } catch (error) {
      next(error);
    }
  }
);

export default patientGetRequestHandler;
