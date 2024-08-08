import { z } from 'zod';
import { getCookieDataByKey } from '@util/index';
import { distributionSchema, genderSchema, maritalStatusSchema } from './enums';
import dateClient from '@lib/date';

export const ONE_MILLION = 1000000;

export const SortModelSchema = z.object({
  sort: z.enum(['asc', 'desc']),
  colId: z.string(),
});

export const startDayDateSchema = z
  .string()
  .refine(dateClient.isISODate, {
    message: 'Not a valid ISO string date.',
  })
  .transform((value) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  });

export const endDayDateSchema = z
  .string()
  .refine(dateClient.isISODate, {
    message: 'Not a valid ISO string date.',
  })
  .transform((value) => {
    const date = new Date(value);
    date.setHours(23, 59, 59, 999);
    return date.toISOString();
  });

export const profileInformationSchema = z.object({
  title: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().optional(),
  phone: z.string(),
  gender: genderSchema,
  dob: startDayDateSchema,
  address: z.string(),
  alternateAddress: z.string().optional(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  countryCode: z.string(),
  zipCode: z.string(),
  profilePic: z.string().optional(),
  religion: z.string().optional(),
  maritalStatus: maritalStatusSchema,
});

export const DateRangeSchema = z.object({
  from: z
    .string()
    .refine(dateClient.isISODate, {
      message: 'Not a valid ISO string date.',
    })
    .default(dateClient.getIsoDateBackdatedByMonth(false, 12)),
  to: z
    .string()
    .refine(dateClient.isISODate, {
      message: 'Not a valid ISO string date.',
    })
    .optional()
    .default(dateClient.getIsoDateBackdatedByMonth(true, 0)),
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
  authorization: z
    .string()
    .refine((data) => data.startsWith('Bearer '), {
      message: "Authorization header must start with 'Bearer '",
    })
    .transform((data) => data.replace('Bearer ', '')),
  // cookie: z
  //   .string()
  //   .transform((data) => getCookieDataByKey(data, 'accessToken')),
});

export const siteIdRequestSchema = z.object({
  siteId: z.string(),
});

export const hospitalIdRequestSchema = z.object({
  hospitalId: z.string(),
});

export const idRequestSchema = z.object({
  id: z.string(),
});

export const getChartRequestSchema = z.object({
  siteId: z.string().optional(),
  fromDate: z
    .string()
    .refine(dateClient.isISODate, {
      message: 'Not a valid ISO string date.',
    })
    .transform((value) => {
      const date = new Date(value);
      date.setHours(0, 0, 0, 0);
      return date.toISOString();
    }),
  toDate: z
    .string()
    .refine(dateClient.isISODate, {
      message: 'Not a valid ISO string date.',
    })
    .transform((value) => {
      const date = new Date(value);
      date.setHours(23, 59, 59, 999);
      return date.toISOString();
    }),
  groupBy: z.enum(['day', 'week', 'month', 'year', 'hour']).default('day'),
});

export const getDistributionRequestSchema = siteIdRequestSchema.extend({
  type: distributionSchema,
});

export const searchRequestSchema = z.object({
  search: z.string().optional(),
  searchKey: z.string().optional(),
  id: z.string().optional(),
  siteId: z.string().optional(),
  range: DateRangeSchema.optional(),
  sortModel: SortModelSchema.default({
    sort: 'desc',
    colId: 'createdAt',
  }),
  startRow: z.coerce.number().min(0).max(ONE_MILLION).default(0),
  endRow: z.coerce.number().min(0).max(ONE_MILLION).default(10),
});
