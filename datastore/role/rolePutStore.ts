import { DefaultJsonResponse } from '@util/responses';
import { roleRepo } from '@typeorm/repositories/roleRepository';

export const updateRoleDataByRoleId = async (id: string, data: Object) => {
  const roleRepository = roleRepo();

  const updatedData = await roleRepository.update(
    {
      id,
    },
    data
  );

  return DefaultJsonResponse(
    Number(updatedData?.affected) >= 1
      ? 'Role Successfully Updated'
      : 'Something Went Wrong',
    null,
    Number(updatedData?.affected) >= 1
  );
};
