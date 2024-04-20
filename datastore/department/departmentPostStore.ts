import { departmentRepo } from '@typeorm/repositories/departmentRepository';
import { DefaultJsonResponse } from '@util/responses';
import { Departments } from '@typeorm/entity/departments';
import { createDepartmentRequestSchema } from '@lib/schemas/departmentSchemas';
import { z } from 'zod';

export const createNewDepartment = async (
  data: z.infer<typeof createDepartmentRequestSchema>
) => {
  const deptRepository = departmentRepo();

  // If Department already exists in the same site, do no create
  const isUnique = await deptRepository
    .createQueryBuilder('department')
    .where('LOWER(department.name) LIKE LOWER(:name)', {
      name: data.name,
    })
    .andWhere('department.siteId = :siteId', {
      siteId: data?.siteId,
    })
    .getCount();

  if (isUnique >= 1)
    return DefaultJsonResponse(
      'Department with name already exists',
      null,
      false
    );

  const department = await deptRepository.save(new Departments(data));

  return DefaultJsonResponse(
    department
      ? 'New Department Created'
      : 'Something happened. Error happened while creating Department',
    null,
    !!department
  );
};
