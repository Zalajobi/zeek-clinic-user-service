import { unitModelProps } from '@typeDesc/index';
import { unitRepo } from '@typeorm/repositories/unitRepositories';
import { DefaultJsonResponse } from '@util/responses';
import { Units } from '@typeorm/entity/units';

export const createNewUnit = async (data: unitModelProps) => {
  const unitRepository = unitRepo();

  // If Unit already exists in the same site, do no create
  const isUnique = await unitRepository
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

  const units = await unitRepository.save(new Units(data));

  return DefaultJsonResponse(
    units
      ? 'New Unit Created'
      : 'Something happened. Error happened while creating Department',
    null,
    !!units
  );
};
