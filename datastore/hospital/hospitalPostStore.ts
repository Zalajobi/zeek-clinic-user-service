import { hospitalRepo } from '@typeorm/repositories/hospitalRepository';
import { Hospital } from '@typeorm/entity/hospital';
import { z } from 'zod';
import { createHospitalRequestSchema } from '@lib/schemas/hospitalSchemas';
import { DefaultJsonResponse } from '@util/responses';

export const createNewHospital = async (
  data: z.infer<typeof createHospitalRequestSchema>
) => {
  const hospitalRepository = hospitalRepo();

  let isUnique;

  isUnique = await hospitalRepository
    .createQueryBuilder('hospital')
    .where('hospital.email = :email OR hospital.phone = :phone', {
      email: data.email,
      phone: data.phone,
    })
    .getOne();

  if (isUnique) {
    throw new Error('Hospital with email or phone already exists');
  }

  const hospital = await hospitalRepository.save(new Hospital(data));

  if (!hospital) {
    throw new Error('Failed to create hospital');
  }

  return DefaultJsonResponse('Hospital created successfully', hospital, true);
};
