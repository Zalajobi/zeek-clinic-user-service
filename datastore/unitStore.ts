// @ts-ignore
import { unitRepo } from '@typeorm/repositories/unitRepositories';
import { DefaultJsonResponse } from '@util/responses';
// @ts-ignore
import { unitModelProps } from '@types/index';
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
      'unit.total_beds',
      'unit.occupied_beds',
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

export const updateUnitDataByUnitId = async (id: string, data: Object) => {
  const unitRepository = unitRepo();

  const updatedData = await unitRepository.update(
    {
      id,
    },
    data
  );

  return DefaultJsonResponse(
    Number(updatedData?.affected) >= 1
      ? 'Unit Successfully Updated'
      : 'Something Went Wrong',
    null,
    Number(updatedData?.affected) >= 1
  );
};
