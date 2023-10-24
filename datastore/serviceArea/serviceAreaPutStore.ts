import { DefaultJsonResponse } from '@util/responses';
import { serviceAreaRepo } from '@typeorm/repositories/serviceAreaRepository';

export const updateServiceAreaDataByUnitId = async (
  id: string,
  data: Object
) => {
  const serviceAreaRepository = serviceAreaRepo();

  const updatedData = await serviceAreaRepository.update(
    {
      id,
    },
    data
  );

  return DefaultJsonResponse(
    Number(updatedData?.affected) >= 1
      ? 'Service Area Successfully Updated'
      : 'Something Went Wrong',
    null,
    Number(updatedData?.affected) >= 1
  );
};
