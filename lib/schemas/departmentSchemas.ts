import { z } from 'zod';
import {
  bearerTokenSchema,
  DateRangeSchema,
  globalStatusSchema,
  ONE_MILLION,
  SortModelSchema,
} from '@lib/schemas/commonSchemas';

export const createDepartmentRequestSchema = z.object({
  siteId: z.string(),
  name: z
    .string()
    .min(4)
    .transform((data) => data.toUpperCase()),
  description: z.string().min(20),
});

export const updateDepartmentRequestSchema = z.object({
  departmentId: z.string(),
  name: z.string().min(4).optional(),
  description: z.string().min(50).optional(),
});

export const getOrganisationDepartmentsFilterRequestSchema = z.object({
  siteId: z.string(),
  page: z.coerce.number().default(0),
  per_page: z.coerce.number().default(20),
  search: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});

export const searchDepartmentRequestSchema = z.object({
  search: z.string().optional(),
  searchKey: z.string().optional(),
  id: z.string().optional(),
  siteId: z.string().optional(),
  name: z.string().optional(),
  range: DateRangeSchema.optional(),
  sortModel: SortModelSchema.default({
    sort: 'desc',
    colId: 'created_at',
  }),
  startRow: z.coerce.number().min(0).max(ONE_MILLION).default(0),
  endRow: z.coerce.number().min(0).max(ONE_MILLION).default(10),
});
