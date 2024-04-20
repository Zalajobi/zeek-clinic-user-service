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
