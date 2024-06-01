import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import {
  getCareGiverPrimaryPatients,
  getPatientChartData,
  getPatientCountBySiteId,
} from '@datastore/patient/patientGetStore';
import { authorizeRequest } from '@middlewares/jwt';
import {
  getChartRequestSchema,
  idRequestSchema,
  siteIdRequestSchema,
} from '@lib/schemas/commonSchemas';

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
      const { id } = idRequestSchema.parse(req.params);
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
    const { siteId } = siteIdRequestSchema.parse(req.params);

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

// Get Chart Data
patientGetRequestHandler.get(
  '/chart',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse request Body
      const { fromDate, toDate, siteId, groupBy } = getChartRequestSchema.parse(
        req.query
      );

      // Get chart data
      const {
        data: chartData,
        message,
        success,
      } = await getPatientChartData(
        new Date(fromDate),
        new Date(toDate),
        groupBy,
        siteId
      );

      return JsonApiResponse(
        res,
        message,
        success,
        chartData,
        success ? 200 : 400
      );
    } catch (error) {
      next(error);
    }
  }
);

export default patientGetRequestHandler;
