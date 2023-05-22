import prisma from "../lib/prisma";

export const adminCreateSite = async (data:string) => {
  // const

  return await prisma.admin.findFirst({
    where: {
      id
    },
    select: {
      id: true,
      email: true,
      role: true
    }
  })
}