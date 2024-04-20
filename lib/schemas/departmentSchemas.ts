import { z } from 'zod';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';

export const createDepartmentRequestSchema = bearerTokenSchema.extend({
  siteId: z.string(),
  name: z.string().min(4),
  description: z.string().min(50),
});

export const updateDepartmentRequestSchema = bearerTokenSchema.extend({
  departmentId: z.string(),
  name: z.string().min(4).optional(),
  description: z.string().min(50).optional(),
});

export const getOrganisationDepartmentsFilterRequestSchema =
  bearerTokenSchema.extend({
    siteId: z.string(),
    page: z.coerce.number().default(0),
    per_page: z.coerce.number().default(20),
    search: z.string().optional(),
    from_date: z.string().optional(),
    to_date: z.string().optional(),
  });
