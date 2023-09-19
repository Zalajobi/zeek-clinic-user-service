import { AppDataSource } from '../../data-source';
import { Site } from '@typeorm/entity/site';

export const siteRepo = () => {
  return AppDataSource.getRepository(Site);
};
