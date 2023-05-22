import prisma from "../lib/prisma";
import {CreateHospitalProps} from "../types/siteAndHospitalTypes";

export const createNewHospital = async (data:CreateHospitalProps) => {
  return  await prisma.hospital.create({
    data
  })
}