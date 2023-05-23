import prisma from "../lib/prisma";
import {createSiteProps} from "../types/siteAndHospitalTypes";

export const adminCreateSite = async (data:createSiteProps) => {
  return await prisma.site.create({
    data
  })
}