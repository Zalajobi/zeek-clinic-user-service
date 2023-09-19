import { unitRepo } from '@typeorm/repositories/unitRepositories';
import { createUnitDataProps } from '@typeorm/objectsTypes/unitObjectTypes';
import { Units } from '@typeorm/entity/units';

export const createNewUnit = async (data: createUnitDataProps) => {
  const unitRepository = unitRepo();

  const newUnit = await unitRepository.save(new Units(data));

  return {
    success: newUnit ? true : false,
    message: newUnit
      ? 'New Unit Added'
      : 'Something happened. Error happened while creating New Unit',
  };
};

export const adminCreateProviderGetUnitsDataBySiteId = async (
  siteId: string
) => {
  const unitRepository = unitRepo();

  return await unitRepository.find({
    where: {
      siteId,
    },
    select: {
      id: true,
      name: true,
    },
  });
};
