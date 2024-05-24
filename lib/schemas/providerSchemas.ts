import { z } from 'zod';
import {
  bearerTokenSchema,
  profileInformationSchema,
} from '@lib/schemas/commonSchemas';
import { globalStatusSchema } from '@lib/schemas/enums';

export const createProviderRequestSchema = profileInformationSchema
  .extend({
    email: z.string(),
    department: z.string(),
    staffId: z.string(),
    role: z.string(),
    serviceArea: z.string(),
    unit: z.string(),
    password: z.string().optional(),
    siteId: z.string(),
    is_consultant: z.boolean().default(false),
    is_specialist: z.boolean().default(false),
    appointments: z.boolean().default(false),
  })
  .refine((data) => {
    return !data.email.includes('+');
  });

export const updateProviderRequestSchema = bearerTokenSchema.extend({
  id: z.string(),
  site: z.string(),
  address: z.string().optional(),
  address_two: z.string().optional(),
  title: z.string().optional(),
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  dob: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  staff_id: z.string().optional(),
  siteId: z.string().optional(),
  username: z.string().optional(),
  marital_status: globalStatusSchema.optional(),
  religion: z.string().optional(),
  departmentId: z.string().optional(),
  primaryRoleId: z.string().optional(),
  serviceareaId: z.string().optional(),
  unitId: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  is_consultant: z.boolean().optional(),
  is_specialist: z.boolean().optional(),
  appointments: z.boolean().optional(),
  profile_pic: z.string().optional(),
  gender: z.string().optional(),
});

export const getOrganisationProvidersFilterRequestSchema = z.object({
  siteId: z.string(),
  page: z.coerce.number().default(0),
  per_page: z.coerce.number().default(20),
  search: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  country: z.string().optional(),
  status: globalStatusSchema.optional(),
});

export const getProviderDetailsRequestSchema = bearerTokenSchema.extend({
  id: z.string(),
});
