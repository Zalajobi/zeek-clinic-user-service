import crypto = require("crypto");
import jwt = require("jsonwebtoken")
import {JWTDataProps} from "../types/user";

export const generatePasswordHash = (password:string) => {
  return crypto.pbkdf2Sync(password, process.env.PASSWORD_HASH_SECRET as string, 1000, 64, 'sha512').toString('hex');
}

export const validatePassword = (reqPassword:string, comparePassword:string) => {
  const generatedPasswordHash = crypto.pbkdf2Sync(reqPassword, process.env.PASSWORD_HASH_SECRET!, 1000, 64, 'sha512').toString('hex')

  return generatedPasswordHash === comparePassword ? true : false;
}

export const generateJSONTokenCredentials = (data:JWTDataProps, exp=Math.floor(Date.now() / 1000) + (60 * 360)) => {
  return jwt.sign({
    data,
    exp, // Expire in 6hrs by default
  }, process.env.JWT_SECRET_KEY as string)
}

export const verifyJSONToken = (bearerToken:string) => {
  return jwt.verify(bearerToken, process.env.JWT_SECRET_KEY as string, (err:any, user:any) => {
    if (err)
      return null

    return user?.data
  })
}