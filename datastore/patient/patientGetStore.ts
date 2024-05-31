import { patientRepo } from '@typeorm/repositories/patientRepository';
import { DefaultJsonResponse } from '@util/responses';
import { searchPatientRequestSchema } from '@lib/schemas/patientSchemas';
import { z } from 'zod';
import { extractPerPageAndPage } from '@util/index';

export const getCareGiverPrimaryPatients = async (providerId: string) => {
  const patientRepository = patientRepo();

  const patientData = await patientRepository
    .createQueryBuilder('patient')
    .where('patient.providerId = :providerId', {
      providerId: providerId,
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

// export const getPatientCountByProviderId = async (providerId: string) => {
//   const patientRepository = patientRepo();
//
//   return patientRepository
//     .createQueryBuilder('patient')
//     .where('patient.careGiverId = :careGiverId', {
//       careGiverId: providerId,
//     })
//     .getCount();
// };

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

export const getSearchPatientData = async (
  requestBody: z.infer<typeof searchPatientRequestSchema>
) => {
  const patientRepository = patientRepo();
  const { page, perPage } = extractPerPageAndPage(
    requestBody.endRow,
    requestBody.startRow
  );

  const baseQuery = patientRepository
    .createQueryBuilder('patient')
    .orderBy(
      `patient.${requestBody.sortModel.colId}`,
      requestBody.sortModel.sort === 'asc' ? 'ASC' : 'DESC'
    )
    .innerJoin('patient.provider', 'provider')
    .innerJoin('patient.unit', 'unit')
    .innerJoin('patient.department', 'department')
    .innerJoin('patient.serviceArea', 'servicearea')
    .select([
      'patient.id AS id',
      'patient.siteId AS "siteId"',
      'patient.status AS status',
      'patient.phone AS phone',
      'patient.dob AS dob',
      'patient.city AS city',
      'patient.state AS state',
      'patient.countryCode AS "countryCode"',
      'patient.religion AS religion',
      'patient.maritalStatus AS "maritalStatus"',
      'patient.zipCode AS "zipCode"',
      'patient.cardNumber AS "cardNumber"',
      'patient.email AS email',
      'patient.title AS title',
      'patient.firstName AS "firstName"',
      'patient.lastName AS "lastName"',
      'patient.middleName AS "middleName"',
      'patient.gender AS gender',
      'patient.address AS address',
      'patient.alternateAddress AS "alternateAddress"',
      'patient.country AS country',
      'patient.profilePic AS "profilePic"',
      'patient.departmentId AS "departmentId"',
      'department.name AS "departmentName"',
      'patient.serviceAreaId AS "serviceAreaId"',
      'servicearea.name AS "serviceAreaName"',
      'patient.unitId AS "unitId"',
      'unit.name AS "unitName"',
      'patient.providerId AS "providerId"',
      'provider.title AS "providerTitle"',
      'provider.firstName AS "providerFirstName"',
      'provider.lastName AS "providerLastName"',
      'patient.createdAt AS "createdAt"',
      'patient.updatedAt AS "updatedAt"',
    ]);

  if (requestBody.search && requestBody.searchKey)
    baseQuery.where(`LOWER(patient.${requestBody.searchKey}) LIKE :search`, {
      search: `%${requestBody.search.toLowerCase()}%`,
    });

  if (requestBody.id)
    baseQuery.andWhere('patient.id = :id', {
      id: requestBody.id,
    });

  if (requestBody.siteId)
    baseQuery.andWhere('patient.siteId = :siteId', {
      siteId: requestBody.siteId,
    });

  if (requestBody.employerId)
    baseQuery.andWhere('patient.employerId = :employerId', {
      employerId: requestBody.employerId,
    });

  if (requestBody.departmentId)
    baseQuery.andWhere('patient.departmentId = :departmentId', {
      departmentId: requestBody.departmentId,
    });

  if (requestBody.serviceAreaId)
    baseQuery.andWhere('patient.serviceAreaId = :serviceAreaId', {
      serviceAreaId: requestBody.serviceAreaId,
    });

  if (requestBody.providerId)
    baseQuery.andWhere('patient.providerId = :providerId', {
      providerId: requestBody.providerId,
    });

  if (requestBody.unitId)
    baseQuery.andWhere('patient.unitId = :unitId', {
      unitId: requestBody.unitId,
    });

  if (requestBody.cardNumber)
    baseQuery.andWhere('LOWER(patient.cardNumber) LIKE :cardNumber', {
      cardNumber: `%${requestBody.cardNumber.toLowerCase()}%`,
    });

  if (requestBody.phone)
    baseQuery.andWhere('LOWER(patient.phone) LIKE :phone', {
      phone: `%${requestBody.phone.toLowerCase()}%`,
    });

  if (requestBody.firstName)
    baseQuery.andWhere('LOWER(patient.firstName) LIKE :firstName', {
      firstName: `%${requestBody.firstName.toLowerCase()}%`,
    });

  if (requestBody.lastName)
    baseQuery.andWhere('LOWER(patient.lastName) LIKE :lastName', {
      lastName: `%${requestBody.lastName.toLowerCase()}%`,
    });

  if (requestBody.middleName)
    baseQuery.andWhere('LOWER(patient.middleName) LIKE :middleName', {
      middleName: `%${requestBody.middleName.toLowerCase()}%`,
    });

  if (requestBody.title)
    baseQuery.andWhere('LOWER(patient.title) LIKE :title', {
      title: `%${requestBody.title.toLowerCase()}%`,
    });

  if (requestBody.gender)
    baseQuery.andWhere('LOWER(patient.gender) LIKE :gender', {
      gender: `%${requestBody.gender.toLowerCase()}%`,
    });

  if (requestBody.dob)
    baseQuery.andWhere('patient.dob = :dob', {
      dob: requestBody.dob,
    });

  if (requestBody.address)
    baseQuery.andWhere('LOWER(patient.address) LIKE :address', {
      address: `%${requestBody.address.toLowerCase()}%`,
    });

  if (requestBody.alternateAddress)
    baseQuery.andWhere(
      'LOWER(patient.alternateAddress) LIKE :alternateAddress',
      {
        alternateAddress: `%${requestBody.alternateAddress.toLowerCase()}%`,
      }
    );

  if (requestBody.city)
    baseQuery.andWhere('LOWER(patient.city) LIKE :city', {
      city: `%${requestBody.city.toLowerCase()}%`,
    });

  if (requestBody.state)
    baseQuery.andWhere('LOWER(patient.state) LIKE :state', {
      state: `%${requestBody.state.toLowerCase()}%`,
    });

  if (requestBody.country)
    baseQuery.andWhere('LOWER(patient.country) LIKE :country', {
      country: `%${requestBody.country.toLowerCase()}%`,
    });

  if (requestBody.countryCode)
    baseQuery.andWhere('LOWER(patient.countryCode) LIKE :countryCode', {
      countryCode: `%${requestBody.countryCode.toLowerCase()}%`,
    });

  if (requestBody.religion)
    baseQuery.andWhere('LOWER(patient.religion) LIKE :religion', {
      religion: `%${requestBody.religion.toLowerCase()}%`,
    });

  if (requestBody.maritalStatus)
    baseQuery.andWhere('patient.maritalStatus = :maritalStatus', {
      maritalStatus: requestBody.maritalStatus,
    });

  if (requestBody.zipCode)
    baseQuery.andWhere('LOWER(patient.zipCode) LIKE :zipCode', {
      zipCode: `%${requestBody.zipCode.toLowerCase()}%`,
    });

  if (requestBody.profilePic)
    baseQuery.andWhere('LOWER(patient.profilePic) LIKE :profilePic', {
      profilePic: `%${requestBody.profilePic.toLowerCase()}%`,
    });

  if (requestBody.email)
    baseQuery.andWhere('LOWER(patient.email) LIKE :email', {
      email: `%${requestBody.email.toLowerCase()}%`,
    });

  if (requestBody.status)
    baseQuery.andWhere('patient.status = :status', {
      status: requestBody.status,
    });

  if (requestBody?.range && requestBody.range.from)
    baseQuery.andWhere('patient.createdAt > :fromDate', {
      fromDate: requestBody.range.from,
    });

  if (requestBody?.range && requestBody.range.to)
    baseQuery.andWhere('patient.createdAt < :toDate', {
      toDate: requestBody.range.to,
    });

  const [rawQuery, parameters] = baseQuery.clone().getQueryAndParameters();

  const modifiedQuery = `${rawQuery} LIMIT ${perPage} OFFSET ${perPage * page}`;

  const [patient, totalRows] = await Promise.all([
    patientRepository.query(modifiedQuery, parameters),

    baseQuery.clone().getCount(),
  ]);

  return DefaultJsonResponse(
    totalRows >= 1 ? 'Patient Data Retrieval Success' : 'No Patient Found',
    {
      patient,
      totalRows,
    },
    !!patient
  );
};
