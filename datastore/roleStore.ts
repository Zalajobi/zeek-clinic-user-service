import { createRoleProps } from "../types";
import {roleRepo} from "../typeorm/repositories/roleRepository";
import {Roles} from "../typeorm/entity/roles";

export const createNewRole = async (data: createRoleProps) => {
  const roleRepository = roleRepo();

  const role = await roleRepository.save(new Roles(data))

  if (role)
    return {
      success: true,
      message: 'New Role Created'
    }

  return {
    success: false,
    message: 'Something happened. Error happened while creating role'
  }
}