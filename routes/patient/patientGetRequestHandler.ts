import { Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { verifyUserPermission } from '@lib/auth';
import { getPatientsDetailsByCareGiverId } from '@datastore/patientStore';
import * as console from 'console';

const patientGetRequestHandler = Router();

// Get the list of providers' primary patients - no pagination
patientGetRequestHandler.get(
  '/provider/primary-patient/all/:providerId',
  async (req, res) => {
    let message = 'Not Authorised',
      success = false;

    const { providerId } = req.params;

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

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 403);

      const patientData = await getPatientsDetailsByCareGiverId(providerId);

      return JsonApiResponse(
        res,
        patientData.message,
        patientData.success as boolean,
        patientData?.data,
        patientData.data ? 200 : 400
      );
    } catch (error) {
      let message = 'Not Authorized';
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, success, null, 500);
    }
  }
);

export default patientGetRequestHandler;
