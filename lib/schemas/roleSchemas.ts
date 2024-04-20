import { z } from 'zod';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';

export const getOrganisationRolesFilterRequestSchema = bearerTokenSchema.extend(
  {
    siteId: z.string(),
    page: z.coerce.number(),
    per_page: z.coerce.number(),
    search: z.string().optional(),
    from_date: z.string().optional(),
    to_date: z.string().optional(),
  }
);

export const createAndUpdateRoleRequestSchema = bearerTokenSchema.extend({
  description: z.string().min(50),
  name: z.string().min(4),
  siteId: z.string().default(''),
  roleId: z.string().default(''),
  prescription: z.boolean().default(false),
  note: z.boolean().default(false),
  procedure: z.boolean().default(false),
  lab_test: z.boolean().default(false),
  appointment: z.boolean().default(false),
  vitals: z.boolean().default(false),
  med_supply: z.boolean().default(false),
  admit_patient: z.boolean().default(false),
  transfer_patient: z.boolean().default(false),
  move_patient: z.boolean().default(false),
  discharge: z.boolean().default(false),
  time_of_death: z.boolean().default(false),
  review: z.boolean().default(false),
  logs: z.boolean().default(false),
  dental: z.boolean().default(false),
  clerking: z.boolean().default(false),
  radiology: z.boolean().default(false),
  consult: z.boolean().default(false),
  referral: z.boolean().default(false),
  refer_outpx: z.boolean().default(false),
  upload: z.boolean().default(false),
  charts: z.boolean().default(false),
  nursing: z.boolean().default(false),
  plan: z.boolean().default(false),
});
