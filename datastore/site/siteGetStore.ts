import { siteRepo } from '@typeorm/repositories/siteRepository';
import { SiteStatus } from '@typeorm/entity/enums';
import { Site } from '@typeorm/entity/site';

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
    .andWhere('site.created_at > :fromDate', {
      fromDate,
    })
    .andWhere('site.created_at < :toDate', {
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
        created_at: 'DESC',
      })
      .getManyAndCount();
  } else {
    sitePagination = await sitePaginationQuery
      .andWhere('site.hospitalId = :hospitalId', {
        hospitalId,
      })
      .orderBy({
        created_at: 'DESC',
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
      created_at: true,
      status: true,
    },
  });
};
