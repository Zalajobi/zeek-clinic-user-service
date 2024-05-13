import { siteRepo } from '@typeorm/repositories/siteRepository';

export const deleteSingleSiteById = async (siteId: string) => {
  return await siteRepo().delete(siteId);
};
