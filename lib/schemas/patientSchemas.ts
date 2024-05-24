import { z } from 'zod';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';
import { globalStatusSchema, maritalStatusSchema } from '@lib/schemas/enums';

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
    status: globalStatusSchema.default('PENDING'),
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
    zipCode: z.coerce.string().optional(),
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
