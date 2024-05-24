import { NextFunction, Request, Response, Router } from 'express';
import { createPatientRequestSchema } from '@lib/schemas/patientSchemas';
import { JsonApiResponse } from '@util/responses';
import {
  generatePasswordHash,
  generateTemporaryPassCode,
  remapObjectKeys,
} from '@util/index';
import { createNewPatient } from '@datastore/patient/patientPostStore';
import { z } from 'zod';
import { emitNewEvent } from '@messaging/rabbitMq';
import { CREATE_PATIENT_QUEUE_NAME } from '@util/config';
import { authorizeRequest } from '@middlewares/jwt';

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

export default patientPostRequestHandler;
