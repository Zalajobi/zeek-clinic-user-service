import prisma from "../lib/prisma";
import {JWTDataProps} from "../types/jwt";
import {verifyJSONToken} from "../helpers/utils";
import {excludeKeys} from "../util";

export const verifyAdmin = async (token:string) => {
  const { id } = await <JWTDataProps><unknown>verifyJSONToken(token)

  return excludeKeys(await prisma.admin.findFirst({
    where: {
      id
    }
  }),  ['password', 'created_at', 'updated_at', 'password_reset_code', 'password_reset_request_timestamp'])
}