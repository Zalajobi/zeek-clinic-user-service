// @ts-ignore
import { unitRepo } from '@typeorm/repositories/unitRepositories';
import { createUnitDataProps } from '@typeorm/objectsTypes/unitObjectTypes';
import { Units } from '@typeorm/entity/units';
import { DefaultJsonResponse } from '@util/responses';

export const createNewUnit = async (data: createUnitDataProps) => {
  const unitRepository = unitRepo();

  const newUnit = await unitRepository.save(new Units(data));

  return {
    success: !!newUnit,
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

export const getUnitDataBySiteID = async (siteId: string) => {
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

// Get Unit in a site by the SiteId and their provider count
export const adminGetUnitsWithProvidersAndPatientsCount = async (
  page: number,
  perPage: number,
  query: string,
  from: string,
  to: string,
  siteId: string
) => {
  const unitRepository = unitRepo();
  let skip = Number(perPage * page),
    take = Number(perPage),
    units = null;
  const fromDate = from ? new Date(from) : new Date('1900-01-01'),
    toDate = to ? new Date(to) : new Date();

  const unitQuery = unitRepository
    .createQueryBuilder('unit')
    .where('unit.siteId = :siteId', { siteId })
    .andWhere('unit.created_at > :fromDate', {
      fromDate,
    })
    .andWhere('unit.created_at < :toDate', {
      toDate,
    })
    .loadRelationCountAndMap('unit.providers', 'unit.providers', 'providers')
    .loadRelationCountAndMap('unit.patients', 'unit.patients', 'patients')
    .select([
      'unit.id',
      'unit.siteId',
      'unit.description',
      'unit.name',
      'unit.created_at',
      'unit.updated_at',
    ]);

  if (query) {
    unitQuery.where(
      'LOWER(unit.name) LIKE :name OR LOWER(unit.description) LIKE :description',
      {
        name: `%${query.toLowerCase()}%`,
        description: `%${query.toLowerCase()}%`,
      }
    );
  }

  if (Number(perPage) === 0) {
    units = await unitQuery.getManyAndCount();
  } else {
    units = await unitQuery.skip(skip).take(take).getManyAndCount();
  }

  return DefaultJsonResponse(
    units ? 'Units Data Retrieval Success' : 'Something Went Wong',
    units,
    !!units
  );
};
