import { verifyJSONToken } from '@util/index';

export const verifyUserPermission = (token: string, roleRequired: string[]) => {
  const tokenUser = verifyJSONToken(token);

  for (const item of roleRequired) {
    if (item === tokenUser?.role) return tokenUser;
  }
  return null;
};
