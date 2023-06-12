import {JWTDataProps} from "../types/jwt";
import {verifyJSONToken} from "../helpers/utils";

export const verifyUserPermission = async (token:string, roleRequired:string[]) => {
  const { role } = await <JWTDataProps><unknown>verifyJSONToken(token)
  console.log(role)

  for (const item of roleRequired) {
    if (item === role)
      return true
  }
  return false
}