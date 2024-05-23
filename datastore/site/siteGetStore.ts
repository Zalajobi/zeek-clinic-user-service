import { siteRepo } from '@typeorm/repositories/siteRepository';
import { SiteStatus } from '@typeorm/entity/enums';
import { Site } from '@typeorm/entity/site';
import { searchSiteRequestSchema } from '@lib/schemas/siteSchemas';
import { z } from 'zod';
import { extractPerPageAndPage } from '@util/index';

export const fetchFilteredSiteData = async (
  page: number,
  perPage: number,
  query: string | undefined,
  from: string | undefined,
  to: string | undefined,
  country: string | undefined,
  status: string | undefined,
  state: string | undefined,
  hospitalId: string
) => {
  const fromDate = from ? new Date(from) : new Date('1900-01-01'),
    toDate = to ? new Date(to) : new Date(),
    siteRepository = siteRepo();
  let sitePagination = null,
    skip = Number(perPage * page),
    take = Number(perPage);

  const sitePaginationQuery = siteRepository
    .createQueryBuilder('site')
    .andWhere('site.createdAt > :fromDate', {
      fromDate,
    })
    .andWhere('site.createdAt < :toDate', {
      toDate,
    });

  if (country) {
    sitePaginationQuery.andWhere('LOWER(site.country) LIKE :country', {
      country: `%${country.toLowerCase()}%`,
    });
  }

  if (status) {
    sitePaginationQuery.andWhere('site.status = :status', {
      status: status as SiteStatus,
    });
  }

  if (state) {
    sitePaginationQuery.andWhere('LOWER(site.state) LIKE :state', {
      state: `%${state.toLowerCase()}%`,
    });
  }

  if (query) {
    sitePaginationQuery.andWhere('LOWER(site.name) LIKE :name', {
      name: `%${query.toLowerCase()}%`,
    });
  }

  if (Number(perPage) === 0) {
    sitePagination = await sitePaginationQuery
      .andWhere('site.hospitalId = :hospitalId', {
        hospitalId,
      })
      .orderBy({
        createdAt: 'DESC',
      })
      .getManyAndCount();
  } else {
    sitePagination = await sitePaginationQuery
      .andWhere('site.hospitalId = :hospitalId', {
        hospitalId,
      })
      .orderBy({
        createdAt: 'DESC',
      })
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  return {
    sites: sitePagination[0],
    count: sitePagination[1],
  };
};

export const getHospitalGeoDetails = async (
  hospitalId: string
): Promise<{ countries: Site[] | null; states: Site[] | null }> => {
  const siteRepository = siteRepo();

  const response = await Promise.all([
    siteRepository
      .createQueryBuilder('site')
      .where('site.hospitalId = :hospitalId', {
        hospitalId,
      })
      .select('DISTINCT ("country")')
      .orderBy({
        country: 'ASC',
      })
      .getRawMany(),

    siteRepository
      .createQueryBuilder('site')
      .where('site.hospitalId = :hospitalId', {
        hospitalId,
      })
      .select('DISTINCT ("state")')
      .orderBy({
        state: 'ASC',
      })
      .getRawMany(),
  ]);

  return {
    countries: response[0],
    states: response[1],
  };
};

export const loadSiteDetailsById = async (siteId: string) => {
  const siteRepository = siteRepo();

  return siteRepository.findOne({
    where: {
      id: siteId,
    },
    select: {
      id: true,
      name: true,
      address: true,
      email: true,
      country: true,
      state: true,
      city: true,
      phone: true,
      createdAt: true,
      status: true,
      countryCode: true,
      zipCode: true,
    },
  });
};

export const getSearchSiteData = async (
  requestBody: z.infer<typeof searchSiteRequestSchema>
) => {
  const siteRepository = siteRepo();
  const { page, perPage } = extractPerPageAndPage(
    requestBody.endRow,
    requestBody.startRow
  );

  const siteQuery = siteRepository
    .createQueryBuilder('site')
    .orderBy(
      `site.${requestBody.sortModel.colId}`,
      requestBody.sortModel.sort === 'asc' ? 'ASC' : 'DESC'
    );

  if (requestBody.hospitalId) {
    siteQuery.where('site.hospitalId = :hospitalId', {
      hospitalId: requestBody.hospitalId,
    });
  }

  if (requestBody.id) {
    siteQuery.where('site.id = :id', {
      id: requestBody.id,
    });
  }

  if (requestBody.country) {
    siteQuery.andWhere('LOWER(site.country) LIKE :country', {
      country: `%${requestBody.country.toLowerCase()}%`,
    });
  }

  if (requestBody.state) {
    siteQuery.andWhere('LOWER(site.state) LIKE :state', {
      state: `%${requestBody.state.toLowerCase()}%`,
    });
  }

  if (requestBody.city) {
    siteQuery.andWhere('LOWER(site.city) LIKE :city', {
      city: `%${requestBody.city.toLowerCase()}%`,
    });
  }

  if (requestBody?.range && requestBody.range.from) {
    siteQuery.andWhere('site.createdAt > :fromDate', {
      fromDate: requestBody.range.from,
    });
  }

  if (requestBody?.range && requestBody.range.to) {
    siteQuery.andWhere('site.createdAt < :toDate', {
      toDate: requestBody.range.to,
    });
  }

  if (requestBody.zipCode) {
    siteQuery.andWhere('site.zipCode = :zipCode', {
      zipCode: requestBody.zipCode,
    });
  }

  if (requestBody.email) {
    siteQuery.andWhere('LOWER(site.email) LIKE :email', {
      email: `%${requestBody.email.toLowerCase()}%`,
    });
  }

  if (requestBody.status) {
    siteQuery.andWhere('site.status = :status', {
      status: requestBody.status,
    });
  }

  if (requestBody.search && requestBody.searchKey) {
    siteQuery.andWhere(`LOWER(site.${requestBody.searchKey}) LIKE :search`, {
      search: `%${requestBody.search.toLowerCase()}%`,
    });
  }

  return await siteQuery
    .skip(perPage * page)
    .take(perPage)
    .getManyAndCount();
};

export const getSiteStatusCountsByHospitalId = async (hospitalId: string) => {
  const siteRepository = siteRepo();

  const [activeSites, closedSites, pendingSites, deactivatedSites, totalSites] =
    await Promise.all([
      siteRepository.count({
        where: {
          hospitalId: hospitalId,
          status: SiteStatus.ACTIVE,
        },
      }),

      siteRepository.count({
        where: {
          hospitalId: hospitalId,
          status: SiteStatus.CLOSED,
        },
      }),

      siteRepository.count({
        where: {
          hospitalId: hospitalId,
          status: SiteStatus.PENDING,
        },
      }),

      siteRepository.count({
        where: {
          hospitalId: hospitalId,
          status: SiteStatus.DEACTIVATED,
        },
      }),

      siteRepository.count({
        where: {
          hospitalId: hospitalId,
        },
      }),
    ]);

  return {
    activeSites,
    closedSites,
    pendingSites,
    deactivatedSites,
    totalSites,
  };
};

export const getSiteCountByEmail = async (email: string) => {
  const siteRepository = siteRepo();
  return siteRepository.count({
    where: {
      email,
    },
  });
};

export const getSiteCountByPhone = async (phone: string) => {
  const siteRepository = siteRepo();
  return siteRepository.count({
    where: {
      phone,
    },
  });
};
