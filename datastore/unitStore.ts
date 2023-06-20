import { unitRepo } from '../typeorm/repositories/unitRepositories';

export const createNewUnit = () => {
  const unitRepository = unitRepo();
};
