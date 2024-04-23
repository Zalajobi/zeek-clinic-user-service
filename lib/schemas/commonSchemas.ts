import { z } from 'zod';

export const LoginRequestSchema = z
  .object({
    email: z.string(),
    password: z.string().min(6),
    rememberMe: z.boolean().default(false),
  })
  .refine((data) => {
    return !data.email.includes('+');
  });

export const bearerTokenSchema = z.object({
  token: z.string(),
});

export const maritalStatusSchema = z.enum([
  'SINGLE',
  'IN_A_RELATIONSHIP',
  'ENGAGED',
  'MARRIED',
  'DIVORCED',
  'WIDOWED',
  'SEPARATED',
  'COMPLICATED',
  'OPEN_RELATIONSHIP',
  'CIVIL_UNION',
  'DOMESTIC_PARTNERSHIP',
  'OTHERS',
]);

export const globalStatusSchema = z.enum([
  'ACTIVE',
  'PENDING',
  'ON_LEAVE',
  'ON_BREAK',
  'SUSPENDED',
  'TERMINATED',
  'UNAVAILABLE',
  'ARCHIVED',
  'DEACTIVATED',
  'CLOSED',
  'DISCHARGED',
  'DECEASED',
  'INPATIENT',
  'OUTPATIENT',
]);
