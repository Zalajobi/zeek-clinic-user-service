import { siteRepo } from '@typeorm/repositories/siteRepository';
import { hospitalRepo } from '@typeorm/repositories/hospitalRepository';
import { Site } from '@typeorm/entity/site';
import { createSiteRequestSchema } from '@lib/schemas/siteSchemas';
import { z } from 'zod';

export const adminCreateSite = async (
  data: z.infer<typeof createSiteRequestSchema>
) => {
  const siteRepository = siteRepo();
  const hospitalRepository = hospitalRepo();

  const isUnique = await siteRepository
    .createQueryBuilder('site')
    .where('LOWER(site.email) LIKE :email', {
      email: data.email.toLowerCase(),
    })
    .orWhere('LOWER(site.phone) = :phone', {
      phone: data.phone.toLowerCase(),
    })
    .getOne();

  if (isUnique)
    return {
      success: false,
      message: 'Site with email address or phone number already exists',
    };

  await siteRepository.save(new Site(data));

  await hospitalRepository.update(
    {
      id: data.hospital_id,
    },
    {
      site_count: data?.totalSites + 1,
    }
  );

  return {
    success: true,
    message: 'New Site Created Successfully',
  };
};
