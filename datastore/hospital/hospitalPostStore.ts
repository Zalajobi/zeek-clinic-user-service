import { hospitalRepo } from '@typeorm/repositories/hospitalRepository';
import { Hospital } from '@typeorm/entity/hospital';
import { z } from 'zod';
import { createHospitalRequestSchema } from '@lib/schemas/hospitalSchemas';

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

  if (isUnique) return false;

  const hospital = await hospitalRepository.save(new Hospital(data));

  if (hospital) {
    return true;
  }
};
