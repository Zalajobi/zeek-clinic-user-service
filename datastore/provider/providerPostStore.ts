import { providerRepo } from '@typeorm/repositories/providerRepository';
import { customPromiseRequest } from '@lib/api';
import { DefaultJsonResponse } from '@util/responses';
import { Provider } from '@typeorm/entity/providers';
import { z } from 'zod';
import { profileDataRequestSchema } from '@lib/schemas/adminSchemas';
import { createProviderRequestSchema } from '@lib/schemas/providerSchemas';

// Post Requests Stores
export const adminCreateNewProvider = async (
  data: z.infer<typeof createProviderRequestSchema> | any,
  personalInfoData: z.infer<typeof profileDataRequestSchema> | any,
  phone: string
) => {
  const providerRepository = providerRepo();

  const [providerCount, staffIdAndCount]: any = await customPromiseRequest([
    providerRepository
      .createQueryBuilder('provider')
      .where('LOWER(provider.email) = :email', {
        email: data?.email?.toLowerCase(),
      })
      // .orWhere('LOWER(provider.username) LIKE LOWER(:username)', {
      //   username: data.username,
      // })
      .getCount(),

    providerRepository
      .createQueryBuilder('provider')
      .where(
        'LOWER(provider.staff_id) = :staffId AND provider.siteId = :siteId',
        {
          staffId: data.staff_id,
          siteId: data.siteId,
        }
      )
      .getCount(),
  ]);

  if (
    providerCount.status.toString() === 'fulfilled' &&
    staffIdAndCount.status.toString() === 'fulfilled'
  ) {
    if (Number(staffIdAndCount?.value.toString()) >= 1) {
      return DefaultJsonResponse(
        'Provider With Staff ID already exists',
        null,
        false
      );
    } else if (Number(providerCount?.value.toString()) >= 1) {
      return DefaultJsonResponse(
        'Provider with Username or Email already exits',
        null,
        false
      );
    }
  }

  return DefaultJsonResponse('Something Went Wrong', null, false);
};
