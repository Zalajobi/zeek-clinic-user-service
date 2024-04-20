import { z } from 'zod';
import { bearerTokenSchema } from '@lib/schemas/commonSchemas';

export const createSiteRequestSchema = bearerTokenSchema
  .extend({
    zip_code: z.coerce.number(),
    country: z.string(),
    state: z.string(),
    city: z.string(),
    address: z.string(),
    phone: z.string(),
    name: z.string().min(4),
    email: z.string().email(),
    logo: z.string().optional(),
    country_code: z.string().optional(),
    is_private: z.boolean().default(false),
    has_appointment: z.boolean().default(false),
    has_caregiver: z.boolean().default(false),
    has_clinical: z.boolean().default(false),
    has_doctor: z.boolean().default(false),
    has_emergency: z.boolean().default(false),
    has_laboratory: z.boolean().default(false),
    has_medical_supply: z.boolean().default(false),
    has_nursing: z.boolean().default(false),
    has_inpatient: z.boolean().default(false),
    has_outpatient: z.boolean().default(false),
    has_pharmacy: z.boolean().default(false),
    has_physical_therapy: z.boolean().default(false),
    has_procedure: z.boolean().default(false),
    has_radiology: z.boolean().default(false),
    has_unit: z.boolean().default(false),
    has_vital: z.boolean().default(false),
    has_wallet: z.boolean().default(false),
    hospital_id: z.string(),
    totalSites: z.coerce.number(),
    time_zone: z.string().optional(),
  })
  .refine((data) => {
    return !data.email.includes('+');
  });

export const getHospitalGeoDetailsRequestSchema = bearerTokenSchema.extend({
  hospitalId: z.string(),
});

export const getOrganisationSiteFilterRequestSchema = bearerTokenSchema.extend({
  page: z.coerce.number(),
  per_page: z.coerce.number(),
  search: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  country: z.string().optional(),
  status: z.string().optional(),
  state: z.string().optional(),
  hospital_id: z.string(),
});

export const getSiteDetailsRequestSchema = bearerTokenSchema.extend({
  siteId: z.string(),
});

export const getSitesOrganizationalStructuresRequestSchema =
  bearerTokenSchema.extend({
    siteId: z.string(),
  });
