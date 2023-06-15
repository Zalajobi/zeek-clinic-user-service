import {departmentRepo} from "../typeorm/repositories/departmentRepository";
import {departmentModelProps} from "../types";
import {Departments} from "../typeorm/entity/departments";

export const createNewDepartment = async (data:departmentModelProps) => {
  const deptRepository = departmentRepo()

  const department = await deptRepository.save(new Departments(data))

  return {
    success: department ? true : false,
    message: department ? 'New Department Created' : 'Something happened. Error happened while creating Department',
  }
}