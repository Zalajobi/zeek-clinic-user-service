import { roleRepo } from '@typeorm/repositories/roleRepository';
import { DefaultJsonResponse } from '@util/responses';
import { searchRoleRequestSchema } from '@lib/schemas/roleSchemas';
import { z } from 'zod';
import { extractPerPageAndPage } from '@util/index';

export const getRoleDataBySiteId = async (siteId: string) => {
  const roleRepository = roleRepo();

  return await roleRepository.find({
    where: {
      siteId,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
};

export const getRolePaginationDataWithUsersCount = async (
  page: number,
  perPage: number,
  query: string,
  from: string,
  to: string,
  siteId: string
) => {
  const roleRepository = roleRepo();
  let skip = Number(perPage * page),
    take = Number(perPage),
    role = null;
  const fromDate = from ? new Date(from) : new Date('1900-01-01'),
    toDate = to ? new Date(to) : new Date();

  const roleQuery = roleRepository
    .createQueryBuilder('role')
    .where('role.siteId = :siteId', { siteId })
    .andWhere('role.createdAt > :fromDate', {
      fromDate,
    })
    .andWhere('role.createdAt < :toDate', {
      toDate,
    })
    .loadRelationCountAndMap('role.providers', 'role.providers', 'providers')
    .select([
      'role.id',
      'role.siteId',
      'role.description',
      'role.name',
      'role.createdAt',
      'role.updatedAt',
      'role.plan',
      'role.prescription',
      'role.note',
      'role.procedure',
      'role.lab_test',
      'role.appointment',
      'role.vitals',
      'role.med_supply',
      'role.admit_patient',
      'role.transfer_patient',
      'role.move_patient',
      'role.discharge',
      'role.time_of_death',
      'role.review',
      'role.logs',
      'role.dental',
      'role.clerking',
      'role.radiology',
      'role.consult',
      'role.referral',
      'role.refer_outpx',
      'role.upload',
      'role.charts',
      'role.nursing',
    ]);

  if (query) {
    roleQuery.where(
      'LOWER(role.name) LIKE :name OR LOWER(role.description) LIKE :description',
      {
        name: `%${query.toLowerCase()}%`,
        description: `%${query.toLowerCase()}%`,
      }
    );
  }

  if (Number(perPage) === 0) {
    role = await roleQuery.getManyAndCount();
  } else {
    role = await roleQuery.skip(skip).take(take).getManyAndCount();
  }

  return DefaultJsonResponse(
    role ? 'Role Data Retrieval Success' : 'Something Went Wong',
    role,
    !!role
  );
};

export const getSearchRoleData = async (
  requestBody: z.infer<typeof searchRoleRequestSchema>
) => {
  const roleRepository = roleRepo();

  const { page, perPage } = extractPerPageAndPage(
    requestBody.endRow,
    requestBody.startRow
  );

  const roleQuery = roleRepository.createQueryBuilder('role').orderBy({
    [`${requestBody.sortModel.colId}`]:
      requestBody.sortModel.sort === 'asc' ? 'ASC' : 'DESC',
  });

  if (requestBody.siteId) {
    roleQuery.where('role.siteId = :siteId', {
      siteId: requestBody.siteId,
    });
  }

  if (requestBody.id) {
    roleQuery.where('role.id = :id', {
      id: requestBody.id,
    });
  }

  if (requestBody.name) {
    roleQuery.where('role.name = :name', {
      name: requestBody.name,
    });
  }

  if (requestBody.description) {
    roleQuery.where('role.description = :description', {
      description: requestBody.description,
    });
  }

  if (requestBody.prescription) {
    roleQuery.andWhere('role.prescription = :prescription', {
      prescription: requestBody.prescription,
    });
  }

  if (requestBody.note) {
    roleQuery.andWhere('role.note = :note', {
      note: requestBody.note,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.appointment) {
    roleQuery.andWhere('role.appointment = :appointment', {
      appointment: requestBody.appointment,
    });
  }

  if (requestBody.vitals) {
    roleQuery.andWhere('role.vitals = :vitals', {
      vitals: requestBody.vitals,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.procedure) {
    roleQuery.andWhere('role.procedure = :procedure', {
      procedure: requestBody.procedure,
    });
  }

  if (requestBody.med_supply) {
    roleQuery.andWhere('role.med_supply = :med_supply', {
      med_supply: requestBody.med_supply,
    });
  }

  if (requestBody.admit_patient) {
    roleQuery.andWhere('role.admit_patient = :admit_patient', {
      admit_patient: requestBody.admit_patient,
    });
  }

  if (requestBody.transfer_patient) {
    roleQuery.andWhere('role.transfer_patient = :transfer_patient', {
      transfer_patient: requestBody.transfer_patient,
    });
  }

  if (requestBody.move_patient) {
    roleQuery.andWhere('role.move_patient = :move_patient', {
      move_patient: requestBody.move_patient,
    });
  }

  if (requestBody.discharge) {
    roleQuery.andWhere('role.discharge = :discharge', {
      discharge: requestBody.discharge,
    });
  }

  if (requestBody.time_of_death) {
    roleQuery.andWhere('role.time_of_death = :time_of_death', {
      time_of_death: requestBody.time_of_death,
    });
  }

  if (requestBody.review) {
    roleQuery.andWhere('role.review = :review', {
      review: requestBody.review,
    });
  }

  if (requestBody.logs) {
    roleQuery.andWhere('role.logs = :logs', {
      logs: requestBody.logs,
    });
  }

  if (requestBody.dental) {
    roleQuery.andWhere('role.dental = :dental', {
      dental: requestBody.dental,
    });
  }

  if (requestBody.dental) {
    roleQuery.andWhere('role.dental = :dental', {
      dental: requestBody.dental,
    });
  }

  if (requestBody.radiology) {
    roleQuery.andWhere('role.radiology = :radiology', {
      radiology: requestBody.radiology,
    });
  }

  if (requestBody.consult) {
    roleQuery.andWhere('role.consult = :consult', {
      consult: requestBody.consult,
    });
  }

  if (requestBody.referral) {
    roleQuery.andWhere('role.referral = :referral', {
      referral: requestBody.referral,
    });
  }

  if (requestBody.refer_outpx) {
    roleQuery.andWhere('role.refer_outpx = :refer_outpx', {
      refer_outpx: requestBody.refer_outpx,
    });
  }

  if (requestBody.upload) {
    roleQuery.andWhere('role.upload = :upload', {
      upload: requestBody.upload,
    });
  }

  if (requestBody.charts) {
    roleQuery.andWhere('role.charts = :charts', {
      charts: requestBody.charts,
    });
  }

  if (requestBody.charts) {
    roleQuery.andWhere('role.charts = :charts', {
      charts: requestBody.charts,
    });
  }

  if (requestBody.plan) {
    roleQuery.andWhere('role.plan = :plan', {
      plan: requestBody.plan,
    });
  }

  if (requestBody?.range && requestBody.range.from) {
    roleQuery.andWhere('role.createdAt > :fromDate', {
      fromDate: requestBody.range.from,
    });
  }

  if (requestBody?.range && requestBody.range.to) {
    roleQuery.andWhere('role.createdAt < :toDate', {
      toDate: requestBody.range.to,
    });
  }

  if (requestBody.search && requestBody.searchKey) {
    roleQuery.andWhere(`LOWER(role.${requestBody.searchKey}) LIKE :search`, {
      search: `%${requestBody.search.toLowerCase()}%`,
    });
  }

  return await roleQuery
    .skip(perPage * page)
    .take(perPage)
    .getManyAndCount();
};

export const getRoleCountBySiteId = async (siteId: string) => {
  const roleRepository = roleRepo();

  return await roleRepository.count({
    where: {
      siteId,
    },
  });
};

export const countRoleItemsByMonth = async (
  fromDate: Date,
  toDate: Date,
  groupBy: string,
  siteId?: string | undefined
) => {
  const roleRepository = roleRepo();

  const roleQuery = roleRepository
    .createQueryBuilder('role')
    .select(`DATE_TRUNC('${groupBy}', role.createdAt) AS date_group`)
    .addSelect('COUNT(*) AS count')
    .where('role.createdAt >= :fromDate', { fromDate })
    .andWhere('role.createdAt <= :toDate', { toDate });

  if (siteId) {
    roleQuery.andWhere('role.siteId = :siteId', { siteId });
  }

  return await roleQuery
    .groupBy(`DATE_TRUNC('${groupBy}', role.createdAt)`)
    .getRawMany();
};
