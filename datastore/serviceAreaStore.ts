// @ts-ignore
import { serviceAreaRepo } from '@typeorm/repositories/serviceAreaRepository';
import { CreateServiceAreaDataProps } from '@typeorm/objectsTypes/serviceAreaObjectType';
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

export const adminCreateProviderGetServiceAreaDataBySiteId = async (
  siteId: string
) => {
  const serviceAreaRepository = serviceAreaRepo();

  return await serviceAreaRepository.find({
    where: {
      siteId,
    },

    select: {
      id: true,
      name: true,
    },
  });
};

export const getServiceAreaDataBySiteId = async (siteId: string) => {
  const serviceAreaRepository = serviceAreaRepo();

  return serviceAreaRepository.find({
    where: {
      siteId,
    },

    select: {
      id: true,
      name: true,
    },
  });
};
