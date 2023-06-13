import prisma from "../lib/prisma";
import {CreateHospitalProps} from "../types/siteAndHospitalTypes";
import {hospitalRepo} from "../typeorm/repositories/hospitalRepository";
import {Between, ILike, LessThan, Like, MoreThan} from "typeorm";
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
  status: HospitalStatus
) => {
  let skip = Number(perPage * page), take = Number(perPage), hospital = null
  const fromDate = from ? new Date(from) : new Date('1999-01-01');
  const toDate = to ? new Date(to) : new Date();

  const hospitalRepository = hospitalRepo()

  if(Number(perPage) === 0) {
    hospital = await hospitalRepository
      .createQueryBuilder('hospital')
      .where("LOWER(hospital.name) LIKE :name OR LOWER(hospital.email) LIKE :email OR LOWER(hospital.phone) LIKE :phone", {
        name: `%${query.toLowerCase()}%`,
        email: `%${query.toLowerCase()}%`,
        phone: `%${query.toLowerCase()}%`,
      })
      .where("hospital.status = :status", {
        status
      })
      .where("LOWER(hospital.country) LIKE :country", {
        country: `%${country.toLowerCase()}%`
      })
      .where("hospital.created_at > :fromDate", {
        fromDate
      })
      .andWhere("hospital.created_at < :toDate", {
        toDate
      })
      .orderBy({
        created_at: 'DESC'
      })
      .getManyAndCount();
  }
  else {
    hospital = await hospitalRepository
      .createQueryBuilder('hospital')
      .where("LOWER(hospital.name) LIKE :name OR LOWER(hospital.email) LIKE :email OR LOWER(hospital.phone) LIKE :phone", {
        name: `%${query.toLowerCase()}%`,
        email: `%${query.toLowerCase()}%`,
        phone: `%${query.toLowerCase()}%`,
      })
      .where("hospital.status = :status", {
        status
      })
      .where("LOWER(hospital.country) LIKE :country", {
        country: `%${country.toLowerCase()}%`
      })
      .where("hospital.created_at > :fromDate", {
        fromDate
      })
      .andWhere("hospital.created_at < :toDate", {
        toDate
      })
      .skip(skip)
      .take(take)
      .orderBy({
        created_at: 'DESC'
      })
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
