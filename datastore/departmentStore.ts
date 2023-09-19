import { departmentRepo } from '../typeorm/repositories/departmentRepository';
import { departmentModelProps } from '../types';
import { Departments } from '../typeorm/entity/departments';

export const createNewDepartment = async (data: departmentModelProps) => {
  const deptRepository = departmentRepo();

  const department = await deptRepository.save(new Departments(data));

  return {
    success: department ? true : false,
    message: department
      ? 'New Department Created'
      : 'Something happened. Error happened while creating Department',
  };
};

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
