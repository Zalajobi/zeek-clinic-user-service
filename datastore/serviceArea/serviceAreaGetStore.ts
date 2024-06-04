import { serviceAreaRepo } from '@typeorm/repositories/serviceAreaRepository';
import { DefaultJsonResponse } from '@util/responses';
import { searchServiceAreaRequestSchema } from '@lib/schemas/serviceAreaSchemas';
import { z } from 'zod';
import { extractPerPageAndPage } from '@util/index';

export const adminCreateProviderGetServiceAreaDataBySiteId = async (
  siteId: string
) => {
  const serviceAreaRepository = serviceAreaRepo();

  return await serviceAreaRepository.find({
    where: {
      siteId,
    },

    select: {
      id: true,
      name: true,
    },
  });
};

export const getServiceAreaDataBySiteId = async (siteId: string) => {
  const serviceAreaRepository = serviceAreaRepo();

  return serviceAreaRepository.find({
    where: {
      siteId,
    },

    select: {
      id: true,
      name: true,
    },
  });
};

export const fetchFilteredServiceAreaData = async (
  page: number,
  perPage: number,
  query: string | undefined,
  from: string | undefined,
  to: string | undefined,
  siteId: string
) => {
  const serviceAreaRepository = serviceAreaRepo();
  let skip = Number(perPage * page),
    take = Number(perPage),
    serviceAreas = null;
  const fromDate = from ? new Date(from) : new Date('1900-01-01'),
    toDate = to ? new Date(to) : new Date();

  const serviceAreaQuery = serviceAreaRepository
    .createQueryBuilder('serviceArea')
    .where('serviceArea.siteId = :siteId', { siteId })
    .andWhere('serviceArea.createdAt > :fromDate', {
      fromDate,
    })
    .andWhere('serviceArea.createdAt < :toDate', {
      toDate,
    })
    .loadRelationCountAndMap(
      'serviceArea.providers',
      'serviceArea.providers',
      'providers'
    )
    .loadRelationCountAndMap(
      'serviceArea.patients',
      'serviceArea.patients',
      'patients'
    )
    .select([
      'serviceArea.id',
      'serviceArea.siteId',
      'serviceArea.description',
      'serviceArea.name',
      'serviceArea.createdAt',
      'serviceArea.updatedAt',
      'serviceArea.type',
    ]);

  if (query) {
    serviceAreaQuery.where(
      'LOWER(serviceArea.name) LIKE :name OR LOWER(serviceArea.description) LIKE :description',
      {
        name: `%${query.toLowerCase()}%`,
        description: `%${query.toLowerCase()}%`,
      }
    );
  }

  if (Number(perPage) === 0) {
    serviceAreas = await serviceAreaQuery.getManyAndCount();
  } else {
    serviceAreas = await serviceAreaQuery
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  return DefaultJsonResponse(
    serviceAreas
      ? 'Service Area Data Retrieval Success'
      : 'Something Went Wong',
    serviceAreas,
    !!serviceAreas
  );
};

export const getServiceAreaCountBySiteId = async (siteId: string) => {
  const serviceAreaRepository = serviceAreaRepo();

  return await serviceAreaRepository.count({
    where: { siteId },
  });
};

// Search Service Area
export const getSearchServiceAreaData = async (
  requestBody: z.infer<typeof searchServiceAreaRequestSchema>
) => {
  const serviceAreaRepository = serviceAreaRepo();

  const { page, perPage } = extractPerPageAndPage(
    requestBody.endRow,
    requestBody.startRow
  );

  const baseQuery = serviceAreaRepository
    .createQueryBuilder('service-area')
    .leftJoin('service-area.providers', 'provider')
    .leftJoin('service-area.patients', 'patient')
    .select([
      'service-area.id AS id',
      'service-area.name AS name',
      'service-area.description AS description',
      'service-area.siteId AS "siteId"',
      'service-area.type AS type',
      'service-area.createdAt AS "createdAt"',
      'service-area.updatedAt AS "updatedAt"',
    ])
    .addSelect('COUNT(DISTINCT provider.id)', 'providerCount')
    .addSelect('COUNT(DISTINCT patient.id)', 'patientCount')
    .groupBy('service-area.id')
    .orderBy(
      `service-area.${requestBody.sortModel.colId}`,
      requestBody.sortModel.sort === 'asc' ? 'ASC' : 'DESC'
    );

  if (requestBody.siteId) {
    baseQuery.where('service-area.siteId = :siteId', {
      siteId: requestBody.siteId,
    });
  }

  if (requestBody.id) {
    baseQuery.where('service-area.id = :id', {
      id: requestBody.id,
    });
  }

  if (requestBody.name) {
    baseQuery.where('service-area.name = :name', {
      name: requestBody.name,
    });
  }

  if (requestBody.type) {
    baseQuery.where('service-area.type = :type', {
      type: requestBody.type,
    });
  }

  if (requestBody?.range && requestBody.range.from) {
    baseQuery.andWhere('service-area.createdAt > :fromDate', {
      fromDate: requestBody.range.from,
    });
  }

  if (requestBody?.range && requestBody.range.to) {
    baseQuery.andWhere('service-area.createdAt < :toDate', {
      toDate: requestBody.range.to,
    });
  }

  if (requestBody.search && requestBody.searchKey) {
    baseQuery.andWhere(
      `LOWER(service-area.${requestBody.searchKey}) LIKE :search`,
      {
        search: `%${requestBody.search.toLowerCase()}%`,
      }
    );
  }

  // Get the raw query and parameter... Edit with the offset and limit and get raw data
  const [rawQuery, parameters] = baseQuery.clone().getQueryAndParameters();
  const modifiedQuery = `${rawQuery} LIMIT ${perPage} OFFSET ${perPage * page}`;

  const [serviceAreas, totalRows] = await Promise.all([
    serviceAreaRepository.query(modifiedQuery, parameters),

    baseQuery.clone().getCount(),
  ]);

  return DefaultJsonResponse(
    serviceAreas
      ? 'Service Area Data Retrieved Successfully'
      : 'Something Went Wrong',
    {
      serviceAreas,
      totalRows,
    },
    !!serviceAreas
  );
};
