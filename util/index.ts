import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {
  JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN,
  PASSWORD_HASH_SECRET,
} from '@util/config';
import { JWTDataProps } from '@typeDesc/jwt';
import { isoDateRegExp } from '@lib/patterns';
import redisClient from '@lib/redis';

export const isObjectEmpty = (obj: Record<string, any>): boolean => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

export const remapObjectKeys = (
  inputObject: Record<string, any>,
  fromKeys: string[],
  toKeys: string[] = fromKeys
): Record<string, any> => {
  const resultObject: Record<string, any> = {};

  if (fromKeys.length !== toKeys.length)
    throw new Error('FromKeys and ToKeys must have the same length');

  for (let i = 0; i < fromKeys.length; i++) {
    const fromKey = fromKeys[i];
    const toKey = toKeys[i];

    if (inputObject.hasOwnProperty(fromKey))
      resultObject[toKey] = inputObject[fromKey];
  }

  return resultObject;
};

export const generatePasswordHash = (password: string) => {
  return crypto
    .pbkdf2Sync(password, PASSWORD_HASH_SECRET, 1000, 64, 'sha512')
    .toString('hex');
};

export const validatePassword = (
  reqPassword: string,
  comparePassword: string
) => {
  const generatedPasswordHash = crypto
    .pbkdf2Sync(reqPassword, PASSWORD_HASH_SECRET, 1000, 64, 'sha512')
    .toString('hex');

  return generatedPasswordHash === comparePassword;
};

export const generateJSONTokenCredentials = (
  data: JWTDataProps,
  exp = Math.floor(Date.now() / 1000) + 60 * 360
) => {
  return jwt.sign(
    {
      data,
      exp, // Expire in 6hrs by default
      // expiresIn: '356 days' //Expire in 365 Days - Meant to test
    },
    JWT_ACCESS_TOKEN
  );
};

export const generateJWTAccessToken = (
  data: JWTDataProps,
  rememberMe: boolean
) => {
  return jwt.sign(data, JWT_ACCESS_TOKEN, {
    // expiresIn: rememberMe ? '365d' : '365d', // Test purpose
    expiresIn: rememberMe ? '1h' : '6m',
  });
};

export const generateJWTRefreshToken = (
  data: JWTDataProps,
  rememberMe: boolean
) => {
  return jwt.sign(data, JWT_REFRESH_TOKEN, {
    expiresIn: rememberMe ? '7d' : '1d',
  });
};

export const verifyJSONToken = (
  bearerToken: string,
  isRefreshToken: boolean
): JWTDataProps | null => {
  let jwtData: JWTDataProps = {};

  jwt.verify(
    bearerToken,
    isRefreshToken ? JWT_REFRESH_TOKEN : JWT_ACCESS_TOKEN,
    (err: any, user: any) => {
      if (err) throw err;

      if (user) jwtData = user;
    }
  );

  return jwtData;
};

// export const generateCode = (length: number = 12): string => {
//   let result = '';
//   const characters =
//     '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
//   const charactersLength = characters.length;
//   let counter = 0;
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     counter += 1;
//   }
//   return result;
// };

export const generateTemporaryPassCode = (length: number = 12): string => {
  let result = '';
  const characters =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

// export const generateTemporaryPassword = () => {
//   return crypto.randomBytes(5).toString('hex').toUpperCase();
// };

export const extractPerPageAndPage = (endRow: number, startRow = 10) => {
  const perPage = endRow - startRow;
  const page = Math.ceil(startRow / perPage);

  return {
    page,
    perPage,
  };
};

export const isISODate = (str: string) => {
  return isoDateRegExp.test(str);
};

export const getIsoDateBackdatedByMonth = (month?: number): string => {
  const currentDate = new Date();
  currentDate.setUTCMonth(currentDate.getUTCMonth() - (month ?? 12));
  return currentDate.toISOString();
};

export const setRedisKey = async (
  key: string,
  value: string,
  expiry: number
) => {
  const client = redisClient.getClient();
  await client.set(key, value, {
    EX: expiry,
  });
};

export const getRedisKey = async (key: string) => {
  const client = redisClient.getClient();

  return (await client.get(key)) as string;
};

export const getCookieDataByKey = (cookie: string, key: string): string => {
  const cookies = cookie.split(';').map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === key) {
      return decodeURIComponent(value);
    }
  }
  return '';
};
