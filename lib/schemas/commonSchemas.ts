import { z } from 'zod';
import { getIsoDateBackdatedByMonth, isISODate } from '@helpers/utils';

export const ONE_MILLION = 1000000;

export const SortModelSchema = z.object({
  sort: z.enum(['asc', 'desc']),
  colId: z.string(),
});

export const DateRangeSchema = z.object({
  from: z
    .string()
    .refine(isISODate, {
      message: 'Not a valid ISO string date.',
    })
    .default(getIsoDateBackdatedByMonth(12)),
  to: z
    .string()
    .refine(isISODate, {
      message: 'Not a valid ISO string date.',
    })
    .optional()
    .default(getIsoDateBackdatedByMonth(0)),
});

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
