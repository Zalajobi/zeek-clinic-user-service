import prisma from "../lib/prisma";
import {CreateHospitalProps} from "../types/siteAndHospitalTypes";
import {hospitalRepo} from "../typeorm/repositories/hospitalRepository";
import {HospitalStatus} from "../typeorm/entity/enums";

interface SuperAdminGetHospitalsProps {
  page: number
  per_page?: number | null
}

// const hospitalStatusTypes = '' | 'ACTIVE' | 'ARCHIVED' | 'PENDING' | 'DEACTIVATED'

export const createNewHospital = async (data:CreateHospitalProps) => {
  let isUnique;

  isUnique = await prisma.hospital.findFirst({
    where: {
      OR: [
        {
          email: data.email
        },

        {
          phone: data.phone
        }
      ]
    }
  })

  if (isUnique)
    return false


  const hospital = await prisma.hospital.create({
    data
  })

  if (hospital) {
    return true
  }
}

export const superAdminGetHospitals = async (
  page: number,
  perPage: number,
  query: string,
  from: string,
  to: string,
  country: string,
  status: string
) => {
  console.log(status)
  let skip = Number(perPage * page), take = Number(perPage), hospital = null
  const fromDate = from ? new Date(from) : new Date('1999-01-01');
  const toDate = to ? new Date(to) : new Date();

  const hospitalRepository = hospitalRepo()

  const hospitalQuery = hospitalRepository
    .createQueryBuilder('hospital')
    .andWhere("hospital.created_at > :fromDate", {
      fromDate
    })
    .andWhere("hospital.created_at < :toDate", {
      toDate
    })


  if (query) {
      hospitalQuery.where("LOWER(hospital.name) LIKE :name OR LOWER(hospital.email) LIKE :email OR LOWER(hospital.phone) LIKE :phone", {
        name: `%${query.toLowerCase()}%`,
        email: `%${query.toLowerCase()}%`,
        phone: `%${query.toLowerCase()}%`,
      })
  }

  if (country) {
    hospitalQuery.andWhere("LOWER(hospital.country) LIKE :country", {
      country: `%${country.toLowerCase()}%`
    })
  }

  if (status) {
    hospitalQuery.andWhere("hospital.status = :status", {
      status: status as HospitalStatus
    })
  }

  if(Number(perPage) === 0) {
    hospital = await hospitalQuery
      .orderBy({
      created_at: 'DESC'
    })
      .getManyAndCount();
  } else  {
    hospital = await hospitalQuery
      .orderBy({
      created_at: 'DESC'
    })
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  return {
    hospitals: hospital[0],
    count: hospital[1],
  }
}

export const selectAllAvailableCountries = async () => {
  const hospitalRepository = hospitalRepo()

  return await hospitalRepository
    .createQueryBuilder('hospital')
    .select('DISTINCT ("country")')
    .orderBy({
      country: 'ASC'
    })
    .getRawMany()
}

export const getHospitalDetails = async (hospitalId: string) => {
  const [hospital, sites, activeSites, closedSites, pendingSites, deactivatedSites, totalSites] = await prisma.$transaction([
    prisma.hospital.findUnique({
      where: {
        id: hospitalId
      }
    }),

    prisma.site.findMany({
      where: {
        hospital_id: hospitalId
      },
      take: 10,
      orderBy: {
        created_at: 'desc'
      }
    }),

    prisma.site.count({
      where: {
        hospital_id: hospitalId,
        status: 'ACTIVE'
      }
    }),

    prisma.site.count({
      where: {
        hospital_id: hospitalId,
        status: 'PENDING'
      }
    }),

    prisma.site.count({
      where: {
        hospital_id: hospitalId,
        status: 'DEACTIVATE'
      }
    }),

    prisma.site.count({
      where: {
        hospital_id: hospitalId,
        status: 'CLOSED'
      }
    }),

    prisma.site.count({
      where: {
        hospital_id: hospitalId,
      }
    }),
  ])

  return {
    hospital: {
      ...hospital,
      activeSites,
      closedSites,
      pendingSites,
      deactivatedSites
    },
    sites,
    tableData: {
      sites: totalSites
    }
  }
}
