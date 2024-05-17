import { z } from 'zod';
import {
  bearerTokenSchema,
  DateRangeSchema,
  ONE_MILLION,
  SortModelSchema,
} from '@lib/schemas/commonSchemas';

export const getOrganisationServiceAreaFilterRequestSchema =
  bearerTokenSchema.extend({
    siteId: z.string(),
    page: z.coerce.number(),
    per_page: z.coerce.number(),
    search: z.string().optional(),
    from_date: z.string().optional(),
    to_date: z.string().optional(),
  });

export const createServiceAreaRequestSchema = z.object({
  siteId: z.string(),
  name: z.string().min(4),
  type: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) =>
      ['INPATIENT', 'PROCEDURE', 'OUTPATIENT', 'EMERGENCY', 'OTHERS'].includes(
        val
      )
    ),
  description: z.string().min(20),
});

export const updateServiceAreaRequestSchema = z.object({
  serviceAreaId: z.string(),
  name: z.string().min(4).optional(),
  type: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) =>
      ['INPATIENT', 'PROCEDURE', 'OUTPATIENT', 'EMERGENCY', 'OTHERS'].includes(
        val
      )
    )
    .optional(),
  description: z.string().min(100).optional(),
});

export const searchServiceAreaRequestSchema = z.object({
  search: z.string().optional(),
  searchKey: z.string().optional(),
  id: z.string().optional(),
  siteId: z.string().optional(),
  name: z.string().optional(),
  range: DateRangeSchema.optional(),
  type: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) =>
      ['INPATIENT', 'PROCEDURE', 'OUTPATIENT', 'EMERGENCY', 'OTHERS'].includes(
        val
      )
    )
    .optional(),
  sortModel: SortModelSchema.default({
    sort: 'desc',
    colId: 'created_at',
  }),
  startRow: z.coerce.number().min(0).max(ONE_MILLION).default(0),
  endRow: z.coerce.number().min(0).max(ONE_MILLION).default(10),
});
