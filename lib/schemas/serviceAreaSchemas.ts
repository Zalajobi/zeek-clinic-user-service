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

export const updateServiceAreaRequestSchema = bearerTokenSchema.extend({
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
