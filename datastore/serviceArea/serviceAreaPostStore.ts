import { serviceAreaRepo } from '@typeorm/repositories/serviceAreaRepository';
import { Servicearea } from '@typeorm/entity/servicearea';
import { DefaultJsonResponse } from '@util/responses';
import {
  createServiceAreaRequestSchema,
  searchServiceAreaRequestSchema,
} from '@lib/schemas/serviceAreaSchemas';
import { z } from 'zod';
import { extractPerPageAndPage } from '@util/index';

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

// Search Service Area
export const getSearchServiceAreaData = async (
  requestBody: z.infer<typeof searchServiceAreaRequestSchema>
) => {
  const serviceAreaRepository = serviceAreaRepo();

  const { page, perPage } = extractPerPageAndPage(
    requestBody.endRow,
    requestBody.startRow
  );

  const serviceAreaQuery = serviceAreaRepository
    .createQueryBuilder('service-area')
    .orderBy({
      [`${requestBody.sortModel.colId}`]:
        requestBody.sortModel.sort === 'asc' ? 'ASC' : 'DESC',
    });

  if (requestBody.siteId) {
    serviceAreaQuery.where('service-area.siteId = :siteId', {
      siteId: requestBody.siteId,
    });
  }

  if (requestBody.id) {
    serviceAreaQuery.where('service-area.id = :id', {
      id: requestBody.id,
    });
  }

  if (requestBody.name) {
    serviceAreaQuery.where('service-area.name = :name', {
      name: requestBody.name,
    });
  }

  if (requestBody.type) {
    serviceAreaQuery.where('service-area.type = :type', {
      type: requestBody.type,
    });
  }

  if (requestBody?.range && requestBody.range.from) {
    serviceAreaQuery.andWhere('service-area.createdAt > :fromDate', {
      fromDate: requestBody.range.from,
    });
  }

  if (requestBody?.range && requestBody.range.to) {
    serviceAreaQuery.andWhere('service-area.createdAt < :toDate', {
      toDate: requestBody.range.to,
    });
  }

  if (requestBody.search && requestBody.searchKey) {
    serviceAreaQuery.andWhere(
      `LOWER(service-area.${requestBody.searchKey}) LIKE :search`,
      {
        search: `%${requestBody.search.toLowerCase()}%`,
      }
    );
  }

  return await serviceAreaQuery
    .skip(perPage * page)
    .take(perPage)
    .getManyAndCount();
};
