import { AppDataSource } from '../../data-source';
import { Departments } from '@typeorm/entity/departments';

export const departmentRepo = () => {
  return AppDataSource.getRepository(Departments);
};
