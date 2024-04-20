import crypto = require('crypto');
import jwt = require('jsonwebtoken');

import { JWTDataProps } from '../types/user';
import { JWT_SECRET_KEY } from '@util/constants';

export const generatePasswordHash = (password: string) => {
  return crypto
    .pbkdf2Sync(
      password,
      process.env.PASSWORD_HASH_SECRET as string,
      1000,
      64,
      'sha512'
    )
    .toString('hex');
};

export const validatePassword = (
  reqPassword: string,
  comparePassword: string
) => {
  const generatedPasswordHash = crypto
    .pbkdf2Sync(
      reqPassword,
      process.env.PASSWORD_HASH_SECRET!,
      1000,
      64,
      'sha512'
    )
    .toString('hex');

  return generatedPasswordHash === comparePassword ? true : false;
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
    JWT_SECRET_KEY
  );
};

export const verifyJSONToken = (bearerToken: string) => {
  return jwt.verify(bearerToken, JWT_SECRET_KEY, (err: any, user: any) => {
    if (err) return null;

    return user?.data;
  });
};

export const generateCode = (length: number = 12): string => {
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

export const generateTemporaryPassword = () => {
  return crypto.randomBytes(5).toString('hex').toUpperCase();
};
