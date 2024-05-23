import { z } from 'zod';
import {
  bearerTokenSchema,
  DateRangeSchema,
  globalStatusSchema,
  ONE_MILLION,
  SortModelSchema,
} from '@lib/schemas/commonSchemas';

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

export const searchHospitalRequestSchema = z
  .object({
    id: z.string().optional(),
    search: z.string().optional(),
    searchKey: z.string().optional(),
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
    range: DateRangeSchema.optional(),
    sortModel: SortModelSchema.default({
      sort: 'desc',
      colId: 'createdAt',
    }),
    startRow: z.coerce.number().min(0).max(ONE_MILLION).default(0),
    endRow: z.coerce.number().min(0).max(ONE_MILLION).default(10),
  })
  .refine((data) => data.endRow > data.startRow, {
    message: 'endRow must be greater than startRow',
    path: ['endRow'],
  });
