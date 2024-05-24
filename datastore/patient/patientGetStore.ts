import { patientRepo } from '@typeorm/repositories/patientRepository';
import { DefaultJsonResponse } from '@util/responses';

export const getCareGiverPrimaryPatients = async (providerId: string) => {
  const patientRepository = patientRepo();

  const patientData = await patientRepository
    .createQueryBuilder('patient')
    .where('patient.careGiverId = :careGiverId', {
      careGiverId: providerId,
    })
    // .leftJoinAndSelect('patient.personalInfo', 'profile')
    .leftJoinAndSelect('patient.department', 'department')
    .leftJoinAndSelect('patient.unit', 'unit')
    .leftJoinAndSelect('patient.servicearea', 'servicearea')
    .select([
      'patient.id',
      'patient.email',
      'patient.status',
      'patient.createdAt',
      'patient.siteId',
      'patient.updatedAt',
      // 'profile.first_name',
      // 'profile.last_name',
      // 'profile.id',
      // 'profile.phone',
      // 'profile.dob',
      // 'profile.title',
      // 'profile.gender',
      // 'profile.country',
      // 'profile.profile_pic',
      // 'profile.middle_name',
      // 'profile.state',
      // 'profile.city',
      // 'profile.address',
      'department.id',
      'department.name',
      'unit.id',
      'unit.name',
      'servicearea.id',
      'servicearea.name',
    ])
    .getMany();

  return DefaultJsonResponse(
    patientData
      ? 'Patient Data Retrieval Success'
      : 'Something went wrong while retrieving data',
    patientData,
    !!patientData
  );
};

export const getPatientCountByProviderId = async (providerId: string) => {
  const patientRepository = patientRepo();

  return patientRepository
    .createQueryBuilder('patient')
    .where('patient.careGiverId = :careGiverId', {
      careGiverId: providerId,
    })
    .getCount();
};

export const getPatientCountByEmail = async (email: string) => {
  const patientRepository = patientRepo();

  return await patientRepository.countBy({
    email,
  });
};

export const getPatientCountBySiteId = async (siteId: string) => {
  const patientRepository = patientRepo();

  return patientRepository.countBy({
    siteId,
  });
};
