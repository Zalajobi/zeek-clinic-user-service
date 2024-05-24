import { z } from 'zod';
import {
  getCookieDataByKey,
  getIsoDateBackdatedByMonth,
  isISODate,
} from '@util/index';
import { genderSchema, maritalStatusSchema } from '@lib/schemas/enums';

export const ONE_MILLION = 1000000;

export const SortModelSchema = z.object({
  sort: z.enum(['asc', 'desc']),
  colId: z.string(),
});

export const startDayDateSchema = z
  .string()
  .refine(isISODate, {
    message: 'Not a valid ISO string date.',
  })
  .transform((value) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  });

export const endDayDateSchema = z
  .string()
  .refine(isISODate, {
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
  dob: z.string(),
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
    .refine(isISODate, {
      message: 'Not a valid ISO string date.',
    })
    .default(getIsoDateBackdatedByMonth(false, 12)),
  to: z
    .string()
    .refine(isISODate, {
      message: 'Not a valid ISO string date.',
    })
    .optional()
    .default(getIsoDateBackdatedByMonth(true, 0)),
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
  // authorization: z
  //   .string()
  //   .refine((data) => data.startsWith('Bearer '), {
  //     message: "Authorization header must start with 'Bearer '",
  //   })
  //   .transform((data) => data.replace('Bearer ', '')),
  cookie: z
    .string()
    .transform((data) => getCookieDataByKey(data, 'accessToken')),
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
