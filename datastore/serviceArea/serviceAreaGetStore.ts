import { serviceAreaRepo } from '@typeorm/repositories/serviceAreaRepository';

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
