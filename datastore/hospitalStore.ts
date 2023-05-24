import prisma from "../lib/prisma";
import {CreateHospitalProps} from "../types/siteAndHospitalTypes";

interface SuperAdminGetHospitalsProps {
  page: number
  per_page?: number | null
}

export const createNewHospital = async (data:CreateHospitalProps) => {
  return  await prisma.hospital.create({
    data
  })
}

export const superAdminGetHospitals = async (page: number, perPage: number, query: string, from: string, to: string) => {
  let where:any = {}, hospitalQuery = null

  if (query)
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