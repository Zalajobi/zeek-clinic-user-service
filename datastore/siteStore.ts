import prisma from "../lib/prisma";
import {JWTDataProps} from "../types/jwt";
import {verifyJSONToken} from "../helpers/utils";

export const verifyAdminStatus = async (token:string) => {
  const { id } = await <JWTDataProps><unknown>verifyJSONToken(token)

  return await prisma.admin.findFirst({
    where: {
      id
    },
    select: {
      id: true,
      email: true,
      role: true
    }
  })
}