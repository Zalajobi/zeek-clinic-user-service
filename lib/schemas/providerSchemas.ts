import { z } from 'zod';
import {
  profileInformationSchema,
  DateRangeSchema,
  ONE_MILLION,
  SortModelSchema,
  startDayDateSchema,
  searchRequestSchema,
} from '@lib/schemas/commonSchemas';
import {
  genderSchema,
  globalStatusSchema,
  maritalStatusSchema,
} from '@lib/schemas/enums';

export const createProviderRequestSchema = profileInformationSchema
  .extend({
    email: z.string().email(),
    departmentId: z.string(),
    staffId: z.string(),
    roleId: z.string(),
    serviceAreaId: z.string(),
    unitId: z.string(),
    password: z.string().optional(),
    siteId: z.string(),
    isConsultant: z.boolean().default(false),
    isSpecialist: z.boolean().default(false),
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
  isConsultant: z.boolean().optional(),
  isSpecialist: z.boolean().optional(),
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

export const searchProviderRequestSchema = searchRequestSchema
  .extend({
    primaryRoleId: z.string().optional(),
    departmentId: z.string().optional(),
    serviceAreaId: z.string().optional(),
    unitId: z.string().optional(),
    appointments: z.boolean().optional(),
    staffId: z.string().optional(),
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
    isSpecialist: z.boolean().optional(),
    isConsultant: z.boolean().optional(),
    email: z.string().optional(),
    status: globalStatusSchema.optional().transform((data) => {
      if (data !== 'ALL') return data;
    }),
  })
  .refine((data) => data.endRow > data.startRow, {
    message: 'endRow must be greater than startRow',
    path: ['endRow'],
  });
