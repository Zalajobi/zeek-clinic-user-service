import { z } from 'zod';
import {
  bearerTokenSchema,
  DateRangeSchema,
  ONE_MILLION,
  SortModelSchema,
} from '@lib/schemas/commonSchemas';

export const createUnitRequestSchema = z.object({
  siteId: z.string(),
  name: z.string().transform((val) => val.toUpperCase()),
  description: z.string().min(20),
  total_beds: z.coerce.number(),
  occupied_beds: z.coerce.number().default(0),
});

export const updateUnitRequestSchema = z.object({
  unitId: z.string(),
  name: z.string().optional(),
  description: z.string().min(50).optional(),
  total_beds: z.coerce.number().optional(),
  occupied_beds: z.coerce.number().optional(),
});

export const getOrganisationUnitsFilterRequestSchema = bearerTokenSchema.extend(
  {
    siteId: z.string(),
    page: z.coerce.number().default(0),
    per_page: z.coerce.number().default(20),
    search: z.string().optional(),
    from_date: z.string().optional(),
    to_date: z.string().optional(),
  }
);

export const searchUnitRequestSchema = z.object({
  search: z.string().optional(),
  searchKey: z.string().optional(),
  id: z.string().optional(),
  siteId: z.string().optional(),
  name: z.string().optional(),
  range: DateRangeSchema.optional(),
  total_beds: z.coerce.number().optional(),
  occupied_beds: z.coerce.number().optional(),
  sortModel: SortModelSchema.default({
    sort: 'desc',
    colId: 'createdAt',
  }),
  startRow: z.coerce.number().min(0).max(ONE_MILLION).default(0),
  endRow: z.coerce.number().min(0).max(ONE_MILLION).default(10),
});
