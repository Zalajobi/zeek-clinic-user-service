import { z } from 'zod';
import { searchRequestSchema } from '@lib/schemas/commonSchemas';

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

export const searchDepartmentRequestSchema = searchRequestSchema
  .extend({
    name: z.string().optional(),
  })
  .refine((data) => data.endRow > data.startRow, {
    message: 'endRow must be greater than startRow',
    path: ['endRow'],
  });

export const createBulkDepartmentRequestSchema = z.object({
  siteId: z.string(),
  data: z.array(
    z.object({
      name: z.string().min(4),
      description: z.string().min(20),
    })
  ),
});
