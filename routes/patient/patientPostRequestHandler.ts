import { NextFunction, Request, Response, Router } from 'express';
import {
  createPatientRequestSchema,
  searchPatientRequestSchema,
} from '@lib/schemas/patientSchemas';
import { JsonApiResponse } from '@util/responses';
import { generatePasswordHash, generateTemporaryPassCode } from '@util/index';
import { createNewPatient } from '@datastore/patient/patientPostStore';
import { authorizeRequest } from '@middlewares/jwt';
import { getSearchPatientData } from '@datastore/patient/patientGetStore';

const patientPostRequestHandler = Router();

patientPostRequestHandler.post(
  '/create',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employer, emergencyContacts, ...patientPayload } =
        createPatientRequestSchema.parse(req.body);

      // Generate temporary password and hash the password... Hash password from schema if it exists
      const tempPassword = generateTemporaryPassCode();
      patientPayload.password = generatePasswordHash(
        patientPayload?.password ?? tempPassword
      );

      const newPatient = await createNewPatient(
        patientPayload,
        employer,
        emergencyContacts
      );

      // if (newPatient.success as boolean) {
      //   emitNewEvent(CREATE_PATIENT_QUEUE_NAME, {
      //     email: requestBody?.email,
      //     firstName: requestBody.first_name,
      //     lastName: requestBody.last_name,
      //     tempPassword,
      //   });
      // }

      return JsonApiResponse(
        res,
        newPatient?.message,
        newPatient?.success,
        null,
        newPatient ? 201 : 400
      );
    } catch (error) {
      next(error);
    }
  }
);

patientPostRequestHandler.post(
  '/search',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = searchPatientRequestSchema.parse(req.body);

      const { data, success, message } = await getSearchPatientData(
        requestBody
      );
      return JsonApiResponse(
        res,
        message,
        success,
        {
          patients: data.patient,
          totalRows: data.totalRows,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

export default patientPostRequestHandler;
