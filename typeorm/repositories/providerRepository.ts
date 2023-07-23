import { AppDataSource } from '../../data-source';
import { Provider } from '../entity/providers';

export const providerRepo = () => {
  return AppDataSource.getRepository(Provider);
};
