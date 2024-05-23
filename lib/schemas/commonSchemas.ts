import { z } from 'zod';
import {
  getCookieDataByKey,
  getIsoDateBackdatedByMonth,
  isISODate,
} from '@util/index';
import { maritalStatusSchema } from '@lib/schemas/enums';

export const ONE_MILLION = 1000000;

export const SortModelSchema = z.object({
  sort: z.enum(['asc', 'desc']),
  colId: z.string(),
});

export const profileInformationSchema = z.object({
  title: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().optional(),
  phone: z.string(),
  gender: z.enum(['Male', 'Female', 'Others']),
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
