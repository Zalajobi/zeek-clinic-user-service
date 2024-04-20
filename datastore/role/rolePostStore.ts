import { roleRepo } from '@typeorm/repositories/roleRepository';
import { Roles } from '@typeorm/entity/roles';
import { DefaultJsonResponse } from '@util/responses';
import { createAndUpdateRoleRequestSchema } from '@lib/schemas/roleSchemas';
import { z } from 'zod';

export const createNewRole = async (
  data: z.infer<typeof createAndUpdateRoleRequestSchema>
) => {
  const roleRepository = roleRepo();

  const isUnique = await roleRepository
    .createQueryBuilder('role')
    .where('LOWER(role.name) LIKE LOWER(:name)', {
      name: data.name,
    })
    .andWhere('role.siteId = :siteId', {
      siteId: data?.siteId,
    })
    .getCount();

  if (isUnique >= 1)
    return DefaultJsonResponse('Role with name already exists', null, false);

  const role = await roleRepository.save(new Roles(data));

  return DefaultJsonResponse(
    role
      ? 'New Role Created'
      : 'Something happened. Error happened while creating role',
    null,
    !!role
  );
};
