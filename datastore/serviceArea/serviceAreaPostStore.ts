import { CreateServiceAreaDataProps } from '@typeorm/objectsTypes/serviceAreaObjectType';
import { serviceAreaRepo } from '@typeorm/repositories/serviceAreaRepository';
import { Servicearea } from '@typeorm/entity/servicearea';
import { DefaultJsonResponse } from '@util/responses';

export const createServiceArea = async (data: CreateServiceAreaDataProps) => {
  const serviceAreaRepository = serviceAreaRepo();

  // If Service Area already exists in the same site, do no create
  const isUnique = await serviceAreaRepository
    .createQueryBuilder('unit')
    .where('LOWER(unit.name) LIKE LOWER(:name)', {
      name: data.name,
    })
    .andWhere('unit.siteId = :siteId', {
      siteId: data?.siteId,
    })
    .getCount();

  if (isUnique >= 1)
    return DefaultJsonResponse('Unit with name already exists', null, false);

  const units = await serviceAreaRepository.save(new Servicearea(data));

  return DefaultJsonResponse(
    units
      ? 'New Service Area Created'
      : 'Something happened. Error happened while creating Department',
    null,
    !!units
  );
};
