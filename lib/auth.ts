import {JWTDataProps} from "../types/jwt";
import {verifyJSONToken} from "../helpers/utils";

export const verifyUserPermission = async (token:string, roleRequired:string[]) => {
  const tokenUser = await <JWTDataProps><unknown>verifyJSONToken(token)

  for (const item of roleRequired) {
    if (item === tokenUser?.role)
      return tokenUser
  }
  return null
}