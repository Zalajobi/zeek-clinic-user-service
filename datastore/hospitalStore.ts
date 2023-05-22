import prisma from "../lib/prisma";
import {CreateHospitalProps} from "../types/hospitalTypes";

export const createNewHospital = async (data:CreateHospitalProps) => {
  return  await prisma.hospital.create({
    data
  })
}