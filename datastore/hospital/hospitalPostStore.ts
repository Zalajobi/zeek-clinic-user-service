import { hospitalModelProps } from '@typeDesc/index';
import { hospitalRepo } from '@typeorm/repositories/hospitalRepository';
import { Hospital } from '@typeorm/entity/hospital';

export const createNewHospital = async (data: hospitalModelProps) => {
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

  const hospital = await hospitalRepository.save(
    new Hospital(data as hospitalModelProps)
  );

  if (hospital) {
    return true;
  }
};
