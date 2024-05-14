import { hospitalRepo } from '@typeorm/repositories/hospitalRepository';
import { HospitalStatus } from '@typeorm/entity/enums';

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

export const getHospitalDetailsById = async (hospitalId: string) => {
  const hospitalRepository = hospitalRepo();

  return await hospitalRepository.findOne({
    where: {
      id: hospitalId,
    },
  });
};

export const fetchFilteredHospitalData = async (
  page: number,
  perPage: number,
  query: string | undefined,
  from: string | undefined,
  to: string | undefined,
  country: string | undefined,
  status: string | undefined
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
