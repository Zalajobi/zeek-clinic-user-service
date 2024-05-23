import { departmentRepo } from '@typeorm/repositories/departmentRepository';
import { DefaultJsonResponse } from '@util/responses';
import { Departments } from '@typeorm/entity/departments';
import { searchDepartmentRequestSchema } from '@lib/schemas/departmentSchemas';
import { z } from 'zod';
import { extractPerPageAndPage } from '@util/index';

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
export const fetchFilteredDepartmentData = async (
  page: number,
  perPage: number,
  query: string | undefined,
  from: string | undefined,
  to: string | undefined,
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
    .andWhere('department.createdAt > :fromDate', {
      fromDate,
    })
    .andWhere('department.createdAt < :toDate', {
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
      'department.createdAt',
      'department.updatedAt',
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
export const getDepartmentDataBySiteId = async (
  siteId: string
): Promise<Departments[] | null> => {
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

// Search Department
export const getSearchDepartmentData = async (
  requestBody: z.infer<typeof searchDepartmentRequestSchema>
) => {
  const deptRepository = departmentRepo();

  const { page, perPage } = extractPerPageAndPage(
    requestBody.endRow,
    requestBody.startRow
  );

  const deptQuery = deptRepository
    .createQueryBuilder('dept')
    .orderBy(
      `dept.${requestBody.sortModel.colId}`,
      requestBody.sortModel.sort === 'asc' ? 'ASC' : 'DESC'
    );

  if (requestBody.siteId) {
    deptQuery.where('dept.siteId = :siteId', {
      siteId: requestBody.siteId,
    });
  }

  if (requestBody.id) {
    deptQuery.where('dept.id = :id', {
      id: requestBody.id,
    });
  }

  if (requestBody.name) {
    deptQuery.where('dept.name = :name', {
      name: requestBody.name,
    });
  }

  if (requestBody?.range && requestBody.range.from) {
    deptQuery.andWhere('dept.createdAt > :fromDate', {
      fromDate: requestBody.range.from,
    });
  }

  if (requestBody?.range && requestBody.range.to) {
    deptQuery.andWhere('dept.createdAt < :toDate', {
      toDate: requestBody.range.to,
    });
  }

  if (requestBody.search && requestBody.searchKey) {
    deptQuery.andWhere(`LOWER(dept.${requestBody.searchKey}) LIKE :search`, {
      search: `%${requestBody.search.toLowerCase()}%`,
    });
  }

  const department = await deptQuery
    .skip(perPage * page)
    .take(perPage)
    .getManyAndCount();

  return DefaultJsonResponse(
    department ? 'Department Data Retrieval Success' : 'Something Went Wong',
    department,
    !!department
  );
};

export const getDepartmentCountBySiteId = async (siteId: string) => {
  const deptRepository = departmentRepo();

  return await deptRepository.count({
    where: {
      siteId,
    },
  });
};
