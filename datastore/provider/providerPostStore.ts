import { providerRepo } from '@typeorm/repositories/providerRepository';
import { customPromiseRequest } from '@lib/api';
import { DefaultJsonResponse } from '@util/responses';
import { z } from 'zod';
import { createProviderRequestSchema } from '@lib/schemas/providerSchemas';
import { Provider } from '@typeorm/entity/providers';

// Post Requests Stores
export const createNewProvider = async (
  data: z.infer<typeof createProviderRequestSchema>
) => {
  const providerRepository = providerRepo();

  const [isUniqueEmail, isUniqueStaffId, isUniquePhone] = await Promise.all([
    providerRepository
      .createQueryBuilder('provider')
      .where('LOWER(provider.email) = :email', {
        email: data.email.toLowerCase(),
      })
      .getCount(),

    providerRepository
      .createQueryBuilder('provider')
      .where('provider.staffId = :staffId AND provider.siteId = :siteId', {
        staffId: data.staffId.toLowerCase(),
        siteId: data.siteId,
      })
      .getCount(),

    providerRepository.countBy({
      phone: data.phone,
      siteId: data.siteId,
    }),
  ]);

  if (isUniqueEmail >= 1)
    return DefaultJsonResponse(
      'Provider with Email already exists',
      null,
      false
    );

  if (isUniqueStaffId >= 1)
    return DefaultJsonResponse(
      'Provider with Staff ID already exists',
      null,
      false
    );

  if (isUniquePhone >= 1)
    return DefaultJsonResponse(
      'Provider with Phone Number already exists',
      null,
      false
    );

  data.staffId = data.staffId.toLowerCase();
  data.email = data.email.toLowerCase();

  const provider = await providerRepository.save(new Provider(data));

  return DefaultJsonResponse(
    provider ? 'Provider Created Successfully' : 'Failed to Create Provider',
    provider,
    !!provider
  );
};
