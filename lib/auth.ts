import { verifyJSONToken } from '@helpers/utils';
import { JWTDataProps } from '@typeDesc/jwt';

export const verifyUserPermission = async (
  token: string,
  roleRequired: string[]
) => {
  const tokenUser = await (<JWTDataProps>(<unknown>verifyJSONToken(token)));

  for (const item of roleRequired) {
    if (item === tokenUser?.role) return tokenUser;
  }
  return null;
};
