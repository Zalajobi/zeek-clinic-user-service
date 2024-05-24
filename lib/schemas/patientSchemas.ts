import { z } from 'zod';
import {
  bearerTokenSchema,
  profileInformationSchema,
} from '@lib/schemas/commonSchemas';
import { globalStatusSchema, maritalStatusSchema } from '@lib/schemas/enums';
import { PatientStatus } from '@typeorm/entity/enums';

export const employerSchema = z.object({
  occupation: z.string(),
  department: z.string().optional(),
  company_name: z.string(),
  company_phone: z.string().optional(),
  company_address: z.string(),
  siteId: z.string().optional(),
});

export const emergencyContactSchema = z.object({
  name: z.string(),
  phone: z.string(),
  address: z.string(),
  relationship: z.string(),
  gender: z.string(),
  occupation: z.string().optional(),
  siteId: z.string().optional(),
  patientId: z.string().optional(),
});

export const createPatientRequestSchema = profileInformationSchema
  .extend({
    cardNumber: z.string(),
    siteId: z.string(),
    departmentId: z.string(),
    serviceAreaId: z.string(),
    unitId: z.string(),
    email: z.string(),
    password: z.string().optional(),
    status: globalStatusSchema.default('PENDING'),
    providerId: z.string(),
    emergencyContacts: z.array(emergencyContactSchema).optional(),
    employer: employerSchema.optional(),
  })
  .refine((data) => {
    return !data.email.includes('+');
  })
  .refine((data) => {
    // Refine and inject site ID to the employer object
    if (data.employer) {
      data.employer.siteId = data.siteId;
    }

    // Refine and inject site ID to the emergency contacts
    if (data.emergencyContacts && data.emergencyContacts.length >= 0) {
      data.emergencyContacts.map((contact) => (contact.siteId = data.siteId));
    }

    return true;
  });

export const updatePatientDetailsRequestSchema = z
  .object({
    id: z.string(),
    personalInfoId: z.string().optional(),
    departmentId: z.string().optional(),
    serviceareaId: z.string().optional(),
    unitId: z.string().optional(),
    careGiverId: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    status: globalStatusSchema.optional(),
  })
  .refine((data) => {
    if (data?.email) {
      !data.email.includes('+');
    }

    return true;
  });

export const getProviderPrimaryPatientRequestSchema = z.object({
  id: z.string(),
});
