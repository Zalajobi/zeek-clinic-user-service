import prisma from "../lib/prisma";
import {CreateHospitalProps} from "../types/siteAndHospitalTypes";

interface SuperAdminGetHospitalsProps {
  page: number
  per_page?: number | null
}

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

export const superAdminGetHospitals = async (page: number, perPage: number, query: string, from: string, to: string, country: string, status: string) => {
  let where:any = {}, hospitalQuery = null

  if (query) {
    where["OR"] = [
      {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },

      {
        email: {
          contains: query,
          mode: 'insensitive'
        }
      },

      {
        phone: {
          contains: query,
          mode: 'insensitive'
        }
      },
    ]
  }

  if (status) {
    where.status = status
  }

  if (country) {
    where.country = {
      contains: country,
      mode: 'insensitive'
    }
  }

  if (from || to) {
    where['created_at'] = {
      gte: from ?? new Date('1999-01-01'),
      lte: to ?? new Date()
    }
  }

  if (Number(perPage) === 0) {
    hospitalQuery = prisma.hospital.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      }
    })
  } else {
    hospitalQuery = prisma.hospital.findMany({
      where,
      take: Number(perPage),
      skip: Number(perPage * page),
      orderBy: {
        created_at: 'desc',
      }
    })
  }

  const [hospitals, count] = await prisma.$transaction([
    hospitalQuery,

    prisma.hospital.count({
      where
    }),
  ])

  return {
    hospitals,
    count,
  }
}

export const selectAllAvailableCountries = async () => {
  return await prisma.hospital.findMany({
    distinct: ['country'],
    select: {
      country: true
    },
    orderBy : {
      country: 'asc'
    }
  })
}

export const getHospitalDetails = async (hospitalId: string) => {
  const [hospital, sites, activeSites, closedSites, pendingSites, deactivatedSites] = await prisma.$transaction([
    prisma.hospital.findUnique({
      where: {
        id: hospitalId
      }
    }),

    prisma.site.findMany({
      where: {
        hospital_id: hospitalId
      },
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
    })
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
  }
}
