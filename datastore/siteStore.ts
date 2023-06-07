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