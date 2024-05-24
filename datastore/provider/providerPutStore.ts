import { providerRepo } from '@typeorm/repositories/providerRepository';
import { isObjectEmpty } from '@util/index';
import { DefaultJsonResponse } from '@util/responses';

// Update provider information
export const updateProviderDetails = async (
  id: string,
  siteId: string,
  data: Record<string, any>
) => {
  const providerRepository = providerRepo();

  let uniqueEmail = 0,
    uniquePhone = 0,
    uniqueStaffId = 0;

  if (isObjectEmpty(data)) throw new Error('No data to update');

  if (data.email) {
    uniqueEmail = await providerRepository.countBy({
      email: data?.email?.toLowerCase(),
    });
  }

  if (data.phone) {
    uniquePhone = await providerRepository.countBy({
      siteId,
      phone: data.phone,
    });
  }

  if (data.staffId) {
    uniqueStaffId = await providerRepository.countBy({
      staffId: data.staffId,
      siteId,
    });
  }

  if (uniqueEmail >= 1)
    throw new Error('A user with the same email already exists.');

  if (uniqueStaffId >= 1)
    throw new Error('A user with the same staffId already exists on the site.');

  if (uniquePhone >= 1)
    throw new Error('A user with the same phone number already exists.');

  const updatedData = await providerRepository.update(
    {
      id,
    },
    data
  );

  return DefaultJsonResponse(
    Number(updatedData?.affected) >= 1
      ? 'Provider Successfully Updated'
      : 'Something Went Wrong',
    null,
    Number(updatedData?.affected) >= 1
  );
};
