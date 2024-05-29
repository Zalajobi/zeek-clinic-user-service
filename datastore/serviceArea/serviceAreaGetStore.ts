import { serviceAreaRepo } from '@typeorm/repositories/serviceAreaRepository';
import { DefaultJsonResponse } from '@util/responses';

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
