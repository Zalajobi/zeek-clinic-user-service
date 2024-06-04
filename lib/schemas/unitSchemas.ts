import { z } from 'zod';
import {
  DateRangeSchema,
  ONE_MILLION,
  searchRequestSchema,
  SortModelSchema,
} from '@lib/schemas/commonSchemas';

export const createUnitRequestSchema = z.object({
  siteId: z.string(),
  name: z.string().transform((val) => val.toUpperCase()),
  description: z.string().min(20),
  totalBeds: z.coerce.number(),
  occupiedBeds: z.coerce.number().default(0),
});

export const updateUnitRequestSchema = z.object({
  unitId: z.string(),
  name: z.string().optional(),
  description: z.string().min(50).optional(),
  totalBeds: z.coerce.number().optional(),
  occupiedBeds: z.coerce.number().optional(),
});

export const getOrganisationUnitsFilterRequestSchema = z.object({
  siteId: z.string(),
  page: z.coerce.number().default(0),
  per_page: z.coerce.number().default(20),
  search: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});

export const searchUnitRequestSchema = searchRequestSchema
  .extend({
    name: z.string().optional(),
    range: DateRangeSchema.optional(),
    totalBeds: z.coerce.number().optional(),
    occupiedBeds: z.coerce.number().optional(),
  })
  .refine((data) => data.endRow > data.startRow, {
    message: 'endRow must be greater than startRow',
    path: ['endRow'],
  });
