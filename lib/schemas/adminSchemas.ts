import { z } from 'zod';
import {
  bearerTokenSchema,
  DateRangeSchema,
  ONE_MILLION,
  profileInformationSchema,
  searchRequestSchema,
  SortModelSchema,
  startDayDateSchema,
} from '@lib/schemas/commonSchemas';
import {
  adminRoleSchema,
  globalStatusSchema,
  maritalStatusSchema,
} from '@lib/schemas/enums';

export const getDepartmentsBySiteIdRequestSchema = bearerTokenSchema.extend({
  siteId: z.string(),
  token: z.string(),
});

export const createAdminRequestSchema = profileInformationSchema
  .extend({
    siteId: z.string(),
    role: adminRoleSchema.transform((data) => {
      if (data !== 'ALL') return data;
    }),
    email: z.string(),
    password: z.string().optional(),
    staffId: z.string(),
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

export const searchAdminRequestSchema = searchRequestSchema
  .extend({
    staffId: z.string().optional(),
    phone: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    role: adminRoleSchema.optional().transform((data) => {
      if (data !== 'ALL') return data;
    }),
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
  })
  .refine((data) => data.endRow > data.startRow, {
    message: 'endRow must be greater than startRow',
    path: ['endRow'],
  });

// For Password Reset timestamp
// password_reset_request_timestamp
