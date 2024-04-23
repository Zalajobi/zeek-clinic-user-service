import 'dotenv/config';

export const BASE_URL = '/api/v1/zeek-clinic/account';
export const CREATE_ADMIN_QUEUE_NAME = 'create_new_admin';

export const CREATE_PATIENT_QUEUE_NAME = 'create_new_patient';

export const USER_SERVICE_EXCHANGE = 'zeek-clinic-user-service';

export const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET!;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

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
