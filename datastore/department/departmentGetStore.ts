import { departmentRepo } from '@typeorm/repositories/departmentRepository';
import { DefaultJsonResponse } from '@util/responses';

export const adminCreateProviderGetDepartmentDataBySiteId = async (
  siteId: string
) => {
  const deptRepository = departmentRepo();

  return await deptRepository.find({
    where: {
      siteId,
    },
    select: {
      id: true,
      name: true,
    },
  });
};

// Get Departments in a site by the SiteId and their provider count
export const adminGetDepartmentsAndProvidersCount = async (
  page: number,
  perPage: number,
  query: string,
  from: string,
  to: string,
  siteId: string
) => {
  const deptRepository = departmentRepo();
  let skip = Number(perPage * page),
    take = Number(perPage),
    departments = null;
  const fromDate = from ? new Date(from) : new Date('1900-01-01'),
    toDate = to ? new Date(to) : new Date();

  const deptQuery = deptRepository
    .createQueryBuilder('department')
    .where('department.siteId = :siteId', { siteId })
    .andWhere('department.created_at > :fromDate', {
      fromDate,
    })
    .andWhere('department.created_at < :toDate', {
      toDate,
    })
    .loadRelationCountAndMap(
      'department.providers',
      'department.providers',
      'providers'
    )
    .loadRelationCountAndMap(
      'department.patients',
      'department.patients',
      'patients'
    )
    .select([
      'department.id',
      'department.siteId',
      'department.description',
      'department.name',
      'department.created_at',
      'department.updated_at',
    ]);

  if (query) {
    deptQuery.where(
      'LOWER(department.name) LIKE :name OR LOWER(department.description) LIKE :description',
      {
        name: `%${query.toLowerCase()}%`,
        description: `%${query.toLowerCase()}%`,
      }
    );
  }

  if (Number(perPage) === 0) {
    departments = await deptQuery.getManyAndCount();
  } else {
    departments = await deptQuery.skip(skip).take(take).getManyAndCount();
  }

  return DefaultJsonResponse(
    departments ? 'Department Data Retrieval Success' : 'Something Went Wong',
    departments,
    !!departments
  );
};

// Get Department By SiteId
export const getDepartmentDataBySiteId = async (siteId: string) => {
  const deptRepository = departmentRepo();

  return await deptRepository.find({
    where: {
      siteId,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
};
