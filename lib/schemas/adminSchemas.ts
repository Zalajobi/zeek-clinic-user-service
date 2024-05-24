import { z } from 'zod';
import {
  bearerTokenSchema,
  profileInformationSchema,
} from '@lib/schemas/commonSchemas';
import { adminRoleSchema } from '@lib/schemas/enums';

export const getDepartmentsBySiteIdRequestSchema = bearerTokenSchema.extend({
  siteId: z.string(),
  token: z.string(),
});

export const createAdminRequestSchema = profileInformationSchema
  .extend({
    siteId: z.string(),
    role: adminRoleSchema,
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

// For Password Reset timestamp
// password_reset_request_timestamp
