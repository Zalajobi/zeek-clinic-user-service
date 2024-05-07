import { hospitalRepo } from '@typeorm/repositories/hospitalRepository';
import { Hospital } from '@typeorm/entity/hospital';

export const incrementTotalSiteCount = async (hospitalId: string) => {
  const hospitalRepository = hospitalRepo();

  try {
    await hospitalRepository
      .createQueryBuilder()
      .update(Hospital)
      .set({ site_count: () => 'site_count + 1' })
      .where('id = :id', { id: hospitalId })
      .execute();
  } catch (error) {
    throw new Error('Error Updating Hospital Site Count');
  }
};
