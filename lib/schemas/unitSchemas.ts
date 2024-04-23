import { z } from 'zod';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';

export const createUnitRequestSchema = bearerTokenSchema.extend({
  siteId: z.string(),
  name: z.string(),
  description: z.string().min(50),
  total_beds: z.coerce.number(),
  occupied_beds: z.coerce.number().default(0),
});

export const updateUnitRequestSchema = bearerTokenSchema.extend({
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
