import {CreateUserProps} from "../types/user";
import prisma from "../lib/prisma";

export const createSuperAdmin = async (data:CreateUserProps) => {
  const isUnique = await prisma.super_admin.findFirst({
    where: {
      OR: [
        {
          email: data.email
        },
        {
          username: data.email
        },
        {
          phone_number: data.email
        }
      ]
    }
  })

  if (isUnique)
    return ("User With Email, Username or Phone Number Already Exist...")

  const user = await prisma.super_admin.create({
    data
  })

  if (user) {
    return user
  }

  return null
}

// export const getAvailableRoles = async () => {
//   const roles = await prisma.admin_role.findMany({})
// }
