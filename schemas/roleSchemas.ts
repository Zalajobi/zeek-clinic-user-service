import { z } from 'zod';
import { bearerTokenSchema, searchRequestSchema } from './commonSchemas';

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

export const createRoleRequestSchema = z.object({
  description: z.string().min(20),
  name: z.string().min(4),
  siteId: z.string(),
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

export const updateRoleRequestSchema = z.object({
  description: z.string().min(50).optional(),
  name: z.string().min(4).optional(),
  roleId: z.string().default(''),
  prescription: z.boolean().optional(),
  note: z.boolean().optional(),
  procedure: z.boolean().optional(),
  lab_test: z.boolean().optional(),
  appointment: z.boolean().optional(),
  vitals: z.boolean().optional(),
  med_supply: z.boolean().optional(),
  admit_patient: z.boolean().optional(),
  transfer_patient: z.boolean().optional(),
  move_patient: z.boolean().optional(),
  discharge: z.boolean().optional(),
  time_of_death: z.boolean().optional(),
  review: z.boolean().optional(),
  logs: z.boolean().optional(),
  dental: z.boolean().optional(),
  clerking: z.boolean().optional(),
  radiology: z.boolean().optional(),
  consult: z.boolean().optional(),
  referral: z.boolean().optional(),
  refer_outpx: z.boolean().optional(),
  upload: z.boolean().optional(),
  charts: z.boolean().optional(),
  nursing: z.boolean().optional(),
  plan: z.boolean().optional(),
});

export const searchRoleRequestSchema = searchRequestSchema
  .extend({
    name: z.string().optional(),
    description: z.string().optional(),
    prescription: z.boolean().optional(),
    note: z.boolean().optional(),
    procedure: z.boolean().optional(),
    lab_test: z.boolean().optional(),
    appointment: z.boolean().optional(),
    vitals: z.boolean().optional(),
    med_supply: z.boolean().optional(),
    admit_patient: z.boolean().optional(),
    transfer_patient: z.boolean().optional(),
    move_patient: z.boolean().optional(),
    discharge: z.boolean().optional(),
    time_of_death: z.boolean().optional(),
    review: z.boolean().optional(),
    logs: z.boolean().optional(),
    dental: z.boolean().optional(),
    clerking: z.boolean().optional(),
    radiology: z.boolean().optional(),
    consult: z.boolean().optional(),
    referral: z.boolean().optional(),
    refer_outpx: z.boolean().optional(),
    upload: z.boolean().optional(),
    charts: z.boolean().optional(),
    nursing: z.boolean().optional(),
    plan: z.boolean().optional(),
  })
  .refine((data) => data.endRow > data.startRow, {
    message: 'endRow must be greater than startRow',
    path: ['endRow'],
  });
