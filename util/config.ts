import 'dotenv/config';

export const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET!;

export const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!;

export const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN!;

export const DATABASE_NAME = process.env.DATABASE_NAME!;

export const DATABASE_PORT = process.env.DATABASE_PORT!;

export const DATABASE_USERNAME = process.env.DATABASE_USERNAME!;

export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD!;

export const DATABASE_HOST = process.env.DATABASE_HOST!;

export const RABBITMQURL = process.env.RABBITMQURL!;

export const TWILLIO_ACCOUNT_SID = process.env.TWILLIO_ACCOUNT_SID!;

export const TWILLIO_AUTH_TOKEN = process.env.TWILLIO_AUTH_TOKEN!;

export const TWILLIO_PHONE_NUMBER = process.env.TWILLIO_PHONE_NUMBER!;

export const GMAIL_SMTP_EMAIL = process.env.GMAIL_SMTP_EMAIL!;

export const GMAIL_SMTP_SECRET = process.env.GMAIL_SMTP_SECRET!;

export const REDIS_HOST = process.env.REDIS_HOST!;

export const REDIS_PASSWORD = process.env.REDIS_PASSWORD!;

export const REDIS_PORT = process.env.REDIS_PORT!;

export const AUTHORIZE_ALL_ADMINS = [
  'ADMIN',
  'SUPER_ADMIN',
  'HOSPITAL_ADMIN',
  'SITE_ADMIN',
  'HUMAN_RESOURCES',
  'HMO_ADMIN',
];

// Configurations here are mutable
export const mutableConfig = {
  TYPEORM_LOGGING_START: false,
};
