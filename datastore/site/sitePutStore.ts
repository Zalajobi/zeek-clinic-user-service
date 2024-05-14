import { siteRepo } from '@typeorm/repositories/siteRepository';

export const updateSingleSiteById = async (siteId: string, data: Object) => {
  const siteRepository = siteRepo();

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
