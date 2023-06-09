import prisma from "../lib/prisma";
import {createSiteProps} from "../types/siteAndHospitalTypes";

export const adminCreateSite = async (data:createSiteProps) => {
  return await prisma.site.create({
    data
  })
}


export const getSiteInformation = async (id: string) => {
  return await prisma.site.findUnique({
    where : {
      id: id
    },

    include: {
      hospital: true,
      bank_accounts: true
    }
  })
}

export const siteTableDatastore = async (page: number, perPage: number, query: string, from: string, to: string, country: string, status: string, state:string, hospitalId:string) => {
  let where:any = {}, siteQuery = null

  where.hospital_id = hospitalId

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

  if (state) {
    where.state = state
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
    siteQuery = prisma.site.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      }
    })
  } else {
    siteQuery = prisma.site.findMany({
      where,
      take: Number(perPage),
      skip: Number(perPage * page),
      orderBy: {
        created_at: 'desc',
      }
    })
  }

  const [sites, count] = await prisma.$transaction([
    siteQuery,

    prisma.site.count({
      where
    }),
  ])

  return {
    sites,
    count,
  }
}

export const getDistinctOrganizationSiteCountriesAndStates = async (hospitalId:string) => {

}
