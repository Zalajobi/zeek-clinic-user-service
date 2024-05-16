import { roleRepo } from '@typeorm/repositories/roleRepository';
import { DefaultJsonResponse } from '@util/responses';

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
    .andWhere('role.created_at > :fromDate', {
      fromDate,
    })
    .andWhere('role.created_at < :toDate', {
      toDate,
    })
    .loadRelationCountAndMap('role.providers', 'role.providers', 'providers')
    .select([
      'role.id',
      'role.siteId',
      'role.description',
      'role.name',
      'role.created_at',
      'role.updated_at',
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
