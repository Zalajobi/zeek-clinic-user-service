import { z } from 'zod';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';

export const getOrganisationServiceAreaFilterRequestSchema =
  bearerTokenSchema.extend({
    siteId: z.string(),
    page: z.coerce.number(),
    per_page: z.coerce.number(),
    search: z.string().optional(),
    from_date: z.string().optional(),
    to_date: z.string().optional(),
  });

export const createServiceAreaRequestSchema = bearerTokenSchema.extend({
  siteId: z.string(),
  name: z.string().min(4),
  type: z.enum(['INPATIENT', 'PROCEDURE', 'OUTPATIENT', 'EMERGENCY', 'OTHERS']),
  description: z.string().min(100),
});

export const updateServiceAreaRequestSchema = bearerTokenSchema.extend({
  serviceAreaId: z.string(),
  name: z.string().min(4).optional(),
  type: z
    .enum(['INPATIENT', 'PROCEDURE', 'OUTPATIENT', 'EMERGENCY', 'OTHERS'])
    .optional(),
  description: z.string().min(100).optional(),
});
