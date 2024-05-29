import { siteRepo } from '@typeorm/repositories/siteRepository';
import { getSiteCountByEmail } from '@datastore/site/siteGetStore';

export const updateSingleSiteById = async (siteId: string, data: any) => {
  const siteRepository = siteRepo();

  if (data.email) {
    const emailCount = await getSiteCountByEmail(data.email as string);

    if (emailCount > 0) {
      throw new Error('Email Already Exists');
    }
  }

  try {
    await siteRepository.update(
      {
        id: siteId,
      },
      data
    );
  } catch (error) {
    throw new Error('Error Updating Site');
  }
};
