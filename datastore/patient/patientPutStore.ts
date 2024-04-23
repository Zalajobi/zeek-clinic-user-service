import { patientRepo } from '@typeorm/repositories/patientRepository';
import { DefaultJsonResponse } from '@util/responses';

export const updatePatientDetails = async (id: string, data: Object) => {
  const patientRepository = patientRepo();

  const updatedData = await patientRepository.update(
    {
      id,
    },
    data
  );

  return DefaultJsonResponse(
    Number(updatedData?.affected) >= 1
      ? 'Patient Successfully Moved'
      : 'Something Went Wrong',
    null,
    Number(updatedData?.affected) >= 1
  );
};
