import { hospitalRepo } from '@typeorm/repositories/hospitalRepository';
import { HospitalStatus } from '@typeorm/entity/enums';
import { z } from 'zod';
import { searchHospitalRequestSchema } from '@lib/schemas/hospitalSchemas';
import { extractPerPageAndPage } from '@helpers/utils';

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

export const getSearchHospitalData = async (
  requestBody: z.infer<typeof searchHospitalRequestSchema>
) => {
  const hospitalRepository = hospitalRepo();

  const { page, perPage } = extractPerPageAndPage(
    requestBody.endRow,
    requestBody.startRow
  );

  const hospitalQuery = hospitalRepository
    .createQueryBuilder('hospital')
    .orderBy({
      [`${requestBody.sortModel.colId}`]:
        requestBody.sortModel.sort === 'asc' ? 'ASC' : 'DESC',
    });

  if (requestBody.id) {
    hospitalQuery.andWhere('hospital.id = :id', {
      id: requestBody.id,
    });
  }

  if (requestBody.site_count) {
    hospitalQuery.andWhere('hospital.site_count = :site_count', {
      site_count: requestBody.site_count,
    });
  }

  if (requestBody.name) {
    hospitalQuery.andWhere('LOWER(hospital.name) LIKE :name', {
      name: `%${requestBody.name.toLowerCase()}%`,
    });
  }

  if (requestBody.email) {
    hospitalQuery.andWhere('LOWER(hospital.email) LIKE :email', {
      email: `%${requestBody.email.toLowerCase()}%`,
    });
  }

  if (requestBody.phone) {
    hospitalQuery.andWhere('hospital.phone = :phone', {
      phone: requestBody.phone,
    });
  }

  if (requestBody.address) {
    hospitalQuery.andWhere('LOWER(hospital.address) LIKE :address', {
      address: `%${requestBody.address.toLowerCase()}%`,
    });
  }

  if (requestBody.city) {
    hospitalQuery.andWhere('LOWER(hospital.city) LIKE :city', {
      city: `%${requestBody.city.toLowerCase()}%`,
    });
  }

  if (requestBody.state) {
    hospitalQuery.andWhere('LOWER(hospital.state) LIKE :city', {
      state: `%${requestBody.state.toLowerCase()}%`,
    });
  }

  if (requestBody.country) {
    hospitalQuery.andWhere('LOWER(hospital.country) LIKE :country', {
      country: `%${requestBody.country.toLowerCase()}%`,
    });
  }

  if (requestBody.status) {
    hospitalQuery.andWhere('hospital.status = :status', {
      status: requestBody.status,
    });
  }

  if (requestBody.zipCode) {
    hospitalQuery.andWhere('hospital.zip_code = :zipCode', {
      zipCode: requestBody.zipCode,
    });
  }

  if (requestBody?.range) {
    hospitalQuery.andWhere('hospital.created_at > :fromDate', {
      fromDate: requestBody.range.from,
    });

    hospitalQuery.andWhere('hospital.created_at < :toDate', {
      toDate: requestBody.range.to,
    });
  }

  if (requestBody.search && requestBody.searchKey) {
    hospitalQuery.andWhere(
      `LOWER(hospital.${requestBody.searchKey}) LIKE :search`,
      {
        search: `%${requestBody.search.toLowerCase()}%`,
      }
    );
  }

  return await hospitalQuery
    .skip(perPage * page)
    .take(perPage)
    .getManyAndCount();
};
