import { serviceAreaRepo } from '@typeorm/repositories/serviceAreaRepository';
import { Servicearea } from '@typeorm/entity/servicearea';
import { DefaultJsonResponse } from '@util/responses';
import { createServiceAreaRequestSchema } from '@lib/schemas/serviceAreaSchemas';
import { z } from 'zod';

export const createServiceArea = async (
  data: z.infer<typeof createServiceAreaRequestSchema>
) => {
  const serviceAreaRepository = serviceAreaRepo();

  // If Service Area already exists in the same site, do no create
  const isUnique = await serviceAreaRepository
    .createQueryBuilder('service-area')
    .where('LOWER(service-area.name) LIKE LOWER(:name)', {
      name: data.name,
    })
    .andWhere('service-area.siteId = :siteId', {
      siteId: data?.siteId,
    })
    .andWhere('service-area.type = :type', {
      type: data.type,
    })
    .getCount();

  if (isUnique >= 1)
    return DefaultJsonResponse(
      'Service Area with NAME and TYPE already exists',
      null,
      false
    );

  const units = await serviceAreaRepository.save(new Servicearea(data));

  return DefaultJsonResponse(
    units
      ? 'New Service Area Created'
      : 'Something happened. Error happened while creating Department',
    null,
    !!units
  );
};
