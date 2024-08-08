import { z } from 'zod';
import {
  DateRangeSchema,
  ONE_MILLION,
  searchRequestSchema,
  SortModelSchema,
} from './commonSchemas';
import { globalStatusSchema } from './enums';

export const createHospitalRequestSchema = z
  .object({
    name: z.string().min(4),
    email: z.string(),
    phone: z.coerce.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    logo: z.string(),
    zipCode: z.coerce.number(),
    countryCode: z.string().optional(),
  })
  .refine((data) => {
    return !data.email.includes('+');
  });

export const hospitalDetailsRequestSchema = z.object({
  id: z.string(),
});

export const getOrganisationHospitalsFilterRequestSchema = z.object({
  page: z.number().default(0),
  per_page: z.coerce.number().default(20),
  search: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  country: z.string().optional(),
  status: globalStatusSchema.optional(),
});

export const searchHospitalRequestSchema = searchRequestSchema
  .extend({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    siteCount: z.string().optional(),
    status: globalStatusSchema.optional().transform((data) => {
      if (data !== 'ALL') return data;
    }),
    zipCode: z.string().optional(),
  })
  .refine((data) => data.endRow > data.startRow, {
    message: 'endRow must be greater than startRow',
    path: ['endRow'],
  });
