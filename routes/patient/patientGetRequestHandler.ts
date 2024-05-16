import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import {
  getCareGiverPrimaryPatients,
  getPatientCountBySiteId,
} from '@datastore/patient/patientGetStore';
import { getProviderPrimaryPatientRequestSchema } from '@lib/schemas/patientSchemas';
import { authorizeRequest } from '@middlewares/jwt';
import { getCountBySiteIdRequestSchema } from '@lib/schemas/commonSchemas';

const patientGetRequestHandler = Router();

// Get the list of providers' primary patients - no pagination
patientGetRequestHandler.get(
  '/care-giver/:id',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = getProviderPrimaryPatientRequestSchema.parse(req.params);
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

patientGetRequestHandler.get(
  '/count/:siteId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { siteId } = getCountBySiteIdRequestSchema.parse(req.params);

    try {
      const count = await getPatientCountBySiteId(siteId);

      return JsonApiResponse(
        res,
        'Success',
        true,
        {
          totalRows: count,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

export default patientGetRequestHandler;
