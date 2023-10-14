import { AppDataSource } from '../../data-source';
import { Provider } from '@typeorm/entity/providers';

export const providerRepo = () => {
  return AppDataSource.getRepository(Provider);
};
