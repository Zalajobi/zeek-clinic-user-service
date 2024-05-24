import { z } from 'zod';
import { profileInformationSchema } from '@lib/schemas/commonSchemas';
import { genderSchema, globalStatusSchema } from '@lib/schemas/enums';

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

export const updateProviderRequestSchema = profileInformationSchema.extend({
  id: z.string(),
  site: z.string(),
  address: z.string().optional(),
  alternateAddress: z.string().optional(),
  title: z.string().optional(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.string().optional(),
  password: z.string().optional(),
  staffId: z.string().optional(),
  siteId: z.string().optional(),
  username: z.string().optional(),
  maritalStatus: globalStatusSchema.optional(),
  religion: z.string().optional(),
  departmentId: z.string().optional(),
  primaryRoleId: z.string().optional(),
  serviceAreaId: z.string().optional(),
  unitId: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  is_consultant: z.boolean().optional(),
  is_specialist: z.boolean().optional(),
  appointments: z.boolean().optional(),
  profilePic: z.string().optional(),
  gender: genderSchema.optional(),
  status: globalStatusSchema.optional(),
  updatedAt: z.date().default(() => new Date()),
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
