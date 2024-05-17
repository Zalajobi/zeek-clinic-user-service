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
import { profileDataRequestSchema } from '@lib/schemas/adminSchemas';
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
    const patientKeys = [
        'email',
        'siteId',
        'departmentId',
        'serviceareaId',
        'unitId',
        'status',
        'password',
      ],
      personalInfoKeys = [
        'address',
        'city',
        'country',
        'dob',
        'first_name',
        'gender',
        'last_name',
        'middle_name',
        'state',
        'title',
        'zip_code',
        'marital_status',
        'phone',
        'profile_pic',
        'religion',
      ];
    try {
      const requestBody = createPatientRequestSchema.parse({
        ...req.headers,
        ...req.body,
      });

      // Generate temporary password and hash the password... Hash password from schema if it exists
      const tempPassword = generateTemporaryPassCode();
      requestBody.password = generatePasswordHash(
        requestBody.password ?? tempPassword
      );

      const newPatient = await createNewPatient(
        remapObjectKeys(requestBody, patientKeys) as z.infer<
          typeof createPatientRequestSchema
        >,
        remapObjectKeys(requestBody, personalInfoKeys) as z.infer<
          typeof profileDataRequestSchema
        >,
        requestBody.employer,
        requestBody.emergencyContacts
      );

      if (newPatient.success as boolean) {
        emitNewEvent(CREATE_PATIENT_QUEUE_NAME, {
          email: requestBody?.email,
          firstName: requestBody.first_name,
          lastName: requestBody.last_name,
          tempPassword,
        });
      }

      return JsonApiResponse(
        res,
        newPatient?.message,
        <boolean>newPatient?.success,
        null,
        201
      );
    } catch (error) {
      next(error);
    }
  }
);

export default patientPostRequestHandler;
