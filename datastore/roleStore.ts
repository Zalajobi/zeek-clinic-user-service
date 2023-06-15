import { roleModelProps } from "../types";
import {roleRepo} from "../typeorm/repositories/roleRepository";
import {Roles} from "../typeorm/entity/roles";

export const createNewRole = async (data: roleModelProps) => {
  const roleRepository = roleRepo();

  const role = await roleRepository.save(new Roles(data))

  return {
    success: role ? true : false,
    message: role ? 'New Role Created' : 'Something happened. Error happened while creating role',
  }
}