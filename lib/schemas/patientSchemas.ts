import { z } from 'zod';
import {
  bearerTokenSchema,
  DateRangeSchema,
  ONE_MILLION,
  profileInformationSchema,
  searchRequestSchema,
  siteIdRequestSchema,
  SortModelSchema,
  startDayDateSchema,
} from '@lib/schemas/commonSchemas';
import {
  distributionSchema,
  globalStatusSchema,
  maritalStatusSchema,
} from '@lib/schemas/enums';
import { PatientStatus } from '@typeorm/entity/enums';

export const employerSchema = z.object({
  occupation: z.string(),
  department: z.string().optional(),
  companyName: z.string(),
  companyPhone: z.string().optional(),
  companyAddress: z.string(),
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

export const searchPatientRequestSchema = searchRequestSchema
  .extend({
    providerId: z.string().optional(),
    departmentId: z.string().optional(),
    serviceAreaId: z.string().optional(),
    employerId: z.string().optional(),
    unitId: z.string().optional(),
    cardNumber: z.string().optional(),
    phone: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    title: z.string().optional(),
    gender: z.string().optional(),
    dob: startDayDateSchema.optional(),
    address: z.string().optional(),
    alternateAddress: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    countryCode: z.string().optional(),
    religion: z.string().optional(),
    maritalStatus: maritalStatusSchema.optional(),
    zipCode: maritalStatusSchema.optional(),
    profilePic: maritalStatusSchema.optional(),
    email: z.string().optional(),
    status: globalStatusSchema.optional().transform((data) => {
      if (data !== 'ALL') return data;
    }),
  })
  .refine((data) => data.endRow > data.startRow, {
    message: 'endRow must be greater than startRow',
    path: ['endRow'],
  });
