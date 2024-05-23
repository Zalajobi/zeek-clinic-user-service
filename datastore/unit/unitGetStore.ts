import { unitRepo } from '@typeorm/repositories/unitRepositories';
import { DefaultJsonResponse } from '@util/responses';
import { searchUnitRequestSchema } from '@lib/schemas/unitSchemas';
import { z } from 'zod';
import { extractPerPageAndPage } from '@util/index';

// Get Unit in a site by the SiteId and their provider count
export const fetchFilteredUnitData = async (
  page: number,
  perPage: number,
  query: string | undefined,
  from: string | undefined,
  to: string | undefined,
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
    .andWhere('unit.createdAt > :fromDate', {
      fromDate,
    })
    .andWhere('unit.createdAt < :toDate', {
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
      'unit.createdAt',
      'unit.updatedAt',
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

export const getSearchUnitData = async (
  requestBody: z.infer<typeof searchUnitRequestSchema>
) => {
  const unitRepository = unitRepo();

  const { page, perPage } = extractPerPageAndPage(
    requestBody.endRow,
    requestBody.startRow
  );

  const unitQuery = unitRepository
    .createQueryBuilder('dept')
    .orderBy(
      `dept.${requestBody.sortModel.colId}`,
      requestBody.sortModel.sort === 'asc' ? 'ASC' : 'DESC'
    );

  if (requestBody.siteId) {
    unitQuery.where('dept.siteId = :siteId', {
      siteId: requestBody.siteId,
    });
  }

  if (requestBody.id) {
    unitQuery.where('dept.id = :id', {
      id: requestBody.id,
    });
  }

  if (requestBody.name) {
    unitQuery.where('dept.name = :name', {
      name: requestBody.name,
    });
  }

  if (requestBody.totalBeds) {
    unitQuery.where('dept.totalBeds >= :totalBeds', {
      totalBeds: requestBody.totalBeds,
    });
  }

  if (requestBody.occupiedBeds) {
    unitQuery.where('dept.occupied_beds >= :occupied_beds', {
      occupied_beds: requestBody.occupiedBeds,
    });
  }

  if (requestBody?.range && requestBody.range.from) {
    unitQuery.andWhere('dept.createdAt > :fromDate', {
      fromDate: requestBody.range.from,
    });
  }

  if (requestBody?.range && requestBody.range.to) {
    unitQuery.andWhere('dept.createdAt < :toDate', {
      toDate: requestBody.range.to,
    });
  }

  if (requestBody.search && requestBody.searchKey) {
    unitQuery.andWhere(`LOWER(dept.${requestBody.searchKey}) LIKE :search`, {
      search: `%${requestBody.search.toLowerCase()}%`,
    });
  }

  const unitData = await unitQuery
    .skip(perPage * page)
    .take(perPage)
    .getManyAndCount();

  return DefaultJsonResponse(
    unitData ? 'Unit Data Retrieval Success' : 'Something Went Wrong',
    unitData,
    !!unitData
  );
};

export const getUnitCountBySiteId = async (siteId: string) => {
  const unitRepository = unitRepo();

  return await unitRepository.count({
    where: { siteId },
  });
};
