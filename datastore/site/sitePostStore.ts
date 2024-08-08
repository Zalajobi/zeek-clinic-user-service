import { siteRepo } from '@typeorm/repositories/siteRepository';
import { hospitalRepo } from '@typeorm/repositories/hospitalRepository';
import { Site } from '@typeorm/entity/site';
import { createSiteRequestSchema } from '../../schemas/siteSchemas';
import { z } from 'zod';
import { DefaultJsonResponse } from '@util/responses';

export const adminCreateSite = async (
  data: z.infer<typeof createSiteRequestSchema>
) => {
  const siteRepository = siteRepo();

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
    throw new Error('Site with email address or phone number already exists');

  const newSite = await siteRepository.save(new Site(data));

  if (!newSite) throw new Error('Failed to create new site');

  return DefaultJsonResponse('Site created successfully', null, !!newSite);
};
