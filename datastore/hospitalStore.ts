import { hospitalModelProps } from '../types';
// @ts-ignore
import { hospitalRepo } from '@typeorm/repositories/hospitalRepository';
import { HospitalStatus, SiteStatus } from '@typeorm/entity/enums';
import { Hospital } from '@typeorm/entity/hospital';
// @ts-ignore
import { siteRepo } from '@typeorm/repositories/siteRepository';

export const createNewHospital = async (data: hospitalModelProps) => {
  const hospitalRepository = hospitalRepo();

  let isUnique;

  isUnique = await hospitalRepository
    .createQueryBuilder('hospital')
    .where('hospital.email = :email OR hospital.phone = :phone', {
      email: data.email,
      phone: data.phone,
    })
    .getOne();

  if (isUnique) return false;

  const hospital = await hospitalRepository.save(
    new Hospital(data as hospitalModelProps)
  );

  if (hospital) {
    return true;
  }
};

export const superAdminGetHospitals = async (
  page: number,
  perPage: number,
  query: string,
  from: string,
  to: string,
  country: string,
  status: string
) => {
  let skip = Number(perPage * page),
    take = Number(perPage),
    hospital = null;
  const fromDate = from ? new Date(from) : new Date('1900-01-01'),
    toDate = to ? new Date(to) : new Date(),
    hospitalRepository = hospitalRepo();

  const hospitalQuery = hospitalRepository
    .createQueryBuilder('hospital')
    .andWhere('hospital.created_at > :fromDate', {
      fromDate,
    })
    .andWhere('hospital.created_at < :toDate', {
      toDate,
    });

  if (query) {
    hospitalQuery.where(
      'LOWER(hospital.name) LIKE :name OR LOWER(hospital.email) LIKE :email OR LOWER(hospital.phone) LIKE :phone',
      {
        name: `%${query.toLowerCase()}%`,
        email: `%${query.toLowerCase()}%`,
        phone: `%${query.toLowerCase()}%`,
      }
    );
  }

  if (country) {
    hospitalQuery.andWhere('LOWER(hospital.country) LIKE :country', {
      country: `%${country.toLowerCase()}%`,
    });
  }

  if (status) {
    hospitalQuery.andWhere('hospital.status = :status', {
      status: status as HospitalStatus,
    });
  }

  if (Number(perPage) === 0) {
    hospital = await hospitalQuery
      .orderBy({
        created_at: 'DESC',
      })
      .getManyAndCount();
  } else {
    hospital = await hospitalQuery
      .orderBy({
        created_at: 'DESC',
      })
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  return {
    hospitals: hospital[0],
    count: hospital[1],
  };
};

export const selectAllAvailableCountries = async () => {
  const hospitalRepository = hospitalRepo();

  return await hospitalRepository
    .createQueryBuilder('hospital')
    .select('DISTINCT ("country")')
    .orderBy({
      country: 'ASC',
    })
    .getRawMany();
};

export const getHospitalDetails = async (hospitalId: string) => {
  const hospitalRepository = hospitalRepo();
  const siteRepository = siteRepo();

  const response = await Promise.all([
    hospitalRepository.findOne({
      where: {
        id: hospitalId,
      },
    }),

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
        status: SiteStatus.DEACTIVATE,
      },
    }),

    siteRepository.findAndCount({
      where: {
        hospitalId: hospitalId,
      },
    }),
  ]);

  return {
    hospital: {
      ...response[0],
      activeSites: response[1],
      closedSites: response[2],
      pendingSites: response[3],
      deactivatedSites: response[4],
    },
    sites: response[5][0],
    tableData: {
      sites: response[5][1],
    },
  };
};
