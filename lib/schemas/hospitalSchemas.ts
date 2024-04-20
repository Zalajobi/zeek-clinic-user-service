import { z } from 'zod';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';

export const createHospitalRequestSchema = bearerTokenSchema
  .extend({
    name: z.string().min(4),
    email: z.string(),
    phone: z.coerce.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    logo: z.string(),
    zip_code: z.coerce.number(),
    country_code: z.string().optional(),
  })
  .refine((data) => {
    return !data.email.includes('+');
  });

export const hospitalDetailsRequestSchema = bearerTokenSchema.extend({
  id: z.string(),
});

export const getOrganisationHospitalsFilterRequestSchema =
  bearerTokenSchema.extend({
    page: z.number().default(0),
    per_page: z.coerce.number().default(20),
    search: z.string().optional(),
    from_date: z.string().optional(),
    to_date: z.string().optional(),
    country: z.string().optional(),
    status: z.string().optional(),
  });
