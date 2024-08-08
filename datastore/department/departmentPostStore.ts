import { departmentRepo } from '@typeorm/repositories/departmentRepository';
import { DefaultJsonResponse } from '@util/responses';
import { Departments } from '@typeorm/entity/departments';
import {
  createBulkDepartmentRequestSchema,
  createDepartmentRequestSchema,
} from '../../schemas/departmentSchemas';
import { z } from 'zod';
import { AppDataSource } from '../../data-source';
import { EntityManager } from 'typeorm';
import { getDepartmentCountBySiteIdAndName } from '@datastore/department/departmentGetStore';

export const createNewDepartment = async (
  data: z.infer<typeof createDepartmentRequestSchema>
) => {
  const deptRepository = departmentRepo();

  // If the Department already exists in the same site, do no create
  const isUnique = await getDepartmentCountBySiteIdAndName(
    data.siteId,
    data.name
  );

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

export const batchCreateDepartment = async (
  requestBody: z.infer<typeof createBulkDepartmentRequestSchema>
) => {
  const departments = requestBody.data.map(
    (department) =>
      new Departments({
        ...department,
        siteId: requestBody.siteId,
      })
  );

  // Function to check if a Department already exists
  const checkExistencePromises = departments.map((department) =>
    getDepartmentCountBySiteIdAndName(department.siteId, department.name)
  );

  console.log('Check Existing Departments');
  // Resolve all existence checks in parallel
  const existingDepartmentCounts = await Promise.all(checkExistencePromises);

  console.log('Existing Departments');

  // Filter out Departments that already exist
  const uniqueDepartments = departments.filter(
    (_department, index) => existingDepartmentCounts[index] === 0
  );

  // Insert the unique Departments
  if (uniqueDepartments.length > 0) {
    await AppDataSource.transaction(async (manager: EntityManager) => {
      await manager.save(Departments, uniqueDepartments);
    });
  }

  return DefaultJsonResponse(
    uniqueDepartments.length > 0
      ? `Created ${uniqueDepartments.length} Departments`
      : 'All Departments already exist',
    null,
    uniqueDepartments.length > 0
  );
};
