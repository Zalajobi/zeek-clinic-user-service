import { providerRepo } from '../typeorm/repositories/providerRepository';
import { createProviderRequestBody, ProviderModelProps } from '../types';
import { Admin } from '../typeorm/entity/admin';
import { Provider } from '../typeorm/entity/providers';
import { getPersonalInfoCountByPhone } from './personalInfoStore';

export const adminCreateNewProvider = async (
  data: ProviderModelProps,
  phone: string
) => {
  const providerRepository = providerRepo();

  const isUnique = await Promise.all([
    getPersonalInfoCountByPhone(phone),

    providerRepository
      .createQueryBuilder('provider')
      .where('LOWER(provider.email) LIKE :email', {
        email: data.email,
      })
      .orWhere('LOWER(provider.username) LIKE :username', {
        username: data.username,
      })
      .select(['provider.email', 'provider.username'])
      .getOne(),
  ]);

  if (isUnique[0] == 0 || !isUnique[1]) console.log('User Information Exist');

  console.log(isUnique);

  // const admin = await providerRepository.save(new Provider(data));
};
