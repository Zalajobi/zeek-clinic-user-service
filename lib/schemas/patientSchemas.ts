import { z } from 'zod';
import {
  bearerTokenSchema,
  maritalStatusSchema,
} from '@lib/schemas/commonSchemas';

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
});

export const createPatientRequestSchema = bearerTokenSchema
  .extend({
    email: z.string(),
    siteId: z.string(),
    // employerId: z.string().optional(),
    departmentId: z.string(),
    serviceareaId: z.string(),
    unitId: z.string(),
    careGiverId: z.string(),
    password: z.string().optional(),
    status: z
      .enum([
        'ACTIVE',
        'PENDING',
        'DISCHARGED',
        'DECEASED',
        'INPATIENT',
        'OUTPATIENT',
      ])
      .default('PENDING'),
    phone: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    middle_name: z.string().optional(),
    title: z.string(),
    gender: z.string(),
    dob: z.string(),
    address: z.string(),
    address_two: z.string().optional(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zip_code: z.coerce.string().optional(),
    profile_pic: z.string().optional(),
    religion: z.string().optional(),
    marital_status: maritalStatusSchema,
    employer: employerSchema.optional(),
    providerId: z.string().optional(),
    emergencyContacts: z.array(emergencyContactSchema).optional(),
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
