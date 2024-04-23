import { z } from 'zod';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';

export const profileDataRequestSchema = z.object({
  phone: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  middle_name: z.string().optional(),
  title: z.string(),
  gender: z.enum(['Male', 'Female', 'Others']),
  dob: z.string(),
  address: z.string(),
  address_two: z.string().optional(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip_code: z.string(),
  profile_pic: z.string().optional(),
  religion: z.string().optional(),
  // providerId: z.string().optional(),
  patientId: z.string().optional(),
  // adminId: z.string().optional(),
  marital_status: z.enum([
    'SINGLE',
    'IN_A_RELATIONSHIP',
    'ENGAGED',
    'MARRIED',
    'DIVORCED',
    'WIDOWED',
    'SEPARATED',
    'COMPLICATED',
    'OPEN_RELATIONSHIP',
    'CIVIL_UNION',
    'DOMESTIC_PARTNERSHIP',
    'OTHERS',
  ]),
});

export const getDepartmentsBySiteIdRequestSchema = bearerTokenSchema.extend({
  siteId: z.string(),
  token: z.string(),
});

export const createAdminRequestSchema = bearerTokenSchema
  .extend({
    siteId: z.string(),
    role: z.string(),
    email: z.string(),
    password: z.string().min(6),
    username: z.string(),
    staff_id: z.string(),
    password_reset_code: z.string().optional(),
    password_reset_request_timestamp: z.string().optional(),
    profileData: profileDataRequestSchema,
  })
  .refine((data) => {
    return !data.email.includes('+');
  });

export const passwordResetRequestSchema = z
  .object({
    email: z.string(),
  })
  .refine((data) => {
    return !data.email.includes('+');
  });

export const updatePasswordRequestSchema = bearerTokenSchema.extend({
  old_password: z.string(),
  new_password: z.string(),
  authorization: z.string(),
});

// For Password Reset timestamp
// password_reset_request_timestamp
