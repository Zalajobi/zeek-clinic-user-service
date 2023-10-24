import { roleRepo } from '@typeorm/repositories/roleRepository';

export const getRoleDataBySiteId = async (siteId: string) => {
  const roleRepository = roleRepo();

  return await roleRepository.find({
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
