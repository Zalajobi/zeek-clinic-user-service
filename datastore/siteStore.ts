import prisma from "../lib/prisma";
import {createSiteProps} from "../types/siteAndHospitalTypes";
import {siteRepo} from "../typeorm/repositories/siteRepository";
import {Site} from "../typeorm/entity/site";
import {hospitalRepo} from "../typeorm/repositories/hospitalRepository";
import {Hospital} from "../typeorm/entity/hospital";
import {SiteStatus} from "../typeorm/entity/enums";

export const adminCreateSite = async (data:createSiteProps) => {
  const siteRepository = siteRepo();
  const hospitalRepository = hospitalRepo();

  const isUnique = await siteRepository.findOneBy(
    {
      email: data.email
    }
  )

  if (isUnique)
    return {
      success: false,
      message: "Site with email address already exists"
    }

  const hospital = await hospitalRepository.findOneBy({
    id: data.hospital_id
  })

  const site = new Site(data as createSiteProps);
  site.hospital = hospital as Hospital

  await siteRepository.save(site)

  await hospitalRepository.update({
    id: data.hospital_id
  }, {
    site_count: hospital?.site_count as number + 1
  })

  return {
    success: true,
    message: "New Site Created Successfully"
  }
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
    where.state = {
      contains: state,
      mode: 'insensitive'
    }
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

  if (Number(perPage) <= 0) {
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
      skip: perPage * page,
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
  const siteRepository = siteRepo()

  const response = await Promise.all([
    siteRepository
      .createQueryBuilder('site')
      .where("site.hospitalId = :hospitalId", {
        hospitalId
      })
      .select('DISTINCT ("country")')
      .orderBy({
        country: 'ASC'
      })
      .getRawMany(),

    siteRepository
      .createQueryBuilder('site')
      .where("site.hospitalId = :hospitalId", {
        hospitalId
      })
      .select('DISTINCT ("state")')
      .orderBy({
        state: 'ASC'
      })
      .getRawMany()
  ])

  return {
    countries: response[0],
    states: response[1]
  }
}
