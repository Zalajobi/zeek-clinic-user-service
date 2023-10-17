import { unitRepo } from '@typeorm/repositories/unitRepositories';
import { DefaultJsonResponse } from '@util/responses';

export const updateUnitDataByUnitId = async (id: string, data: Object) => {
  const unitRepository = unitRepo();

  const updatedData = await unitRepository.update(
    {
      id,
    },
    data
  );

  return DefaultJsonResponse(
    Number(updatedData?.affected) >= 1
      ? 'Unit Successfully Updated'
      : 'Something Went Wrong',
    null,
    Number(updatedData?.affected) >= 1
  );
};
