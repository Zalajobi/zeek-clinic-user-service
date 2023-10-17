import { CreateServiceAreaDataProps } from '@typeorm/objectsTypes/serviceAreaObjectType';
import { serviceAreaRepo } from '@typeorm/repositories/serviceAreaRepository';
import { Servicearea } from '@typeorm/entity/servicearea';

export const createServiceArea = async (data: CreateServiceAreaDataProps) => {
  const serviceAreaRepository = serviceAreaRepo();

  const newServiceArea = await serviceAreaRepository.save(
    new Servicearea(data)
  );

  return {
    success: !!newServiceArea,
    message: newServiceArea
      ? 'New Service Area Created'
      : 'Something Happened. Error happened While Creating Service Area',
  };
};
