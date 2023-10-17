import { departmentRepo } from '@typeorm/repositories/departmentRepository';
import { DefaultJsonResponse } from '@util/responses';

export const updateDepartmentDataByDepartmentId = async (
  id: string,
  data: Object
) => {
  const deptRepository = departmentRepo();

  const updatedData = await deptRepository.update(
    {
      id,
    },
    data
  );

  return DefaultJsonResponse(
    Number(updatedData?.affected) >= 1
      ? 'Department Successfully Updated'
      : 'Something Went Wrong',
    null,
    Number(updatedData?.affected) >= 1
  );
};
