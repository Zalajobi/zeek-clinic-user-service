import { providerRepo } from '../typeorm/repositories/providerRepository';
import { createProviderRequestBody } from '../types';

export const adminCreateNewProvider = async (
  data: createProviderRequestBody
) => {
  const providerRepository = providerRepo();
};
