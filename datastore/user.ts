import prisma from "../lib/prisma";
import {CreateUserProps} from "../types/user";

export const createAdmin = async (data:CreateUserProps) => {
  const isUnique = await prisma.admin.findFirst({
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

  const user = await prisma.admin.create({
    data
  })

  if (user) {
    return user
  }

  return null
}

export const getAdminBaseData = async (value:string) => {
  return await prisma.admin.findFirst({
    where: {
      OR: [
        {
          email: value
        },
        {
          username: value
        },
        // {
        //   phone_number: value
        // },
        {
          id: value
        }
      ]
    },
    select: {
      email: true,
      password: true,
      role: true,
      id: true,
      first_name: true
    }
  })
}

export const updateAdminPassword = async (id:string, password:string) => {
  return await prisma.admin.update({
    where: {
      id
    },
    data: {
      password
    }
  })
}
