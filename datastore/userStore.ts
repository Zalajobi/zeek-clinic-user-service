import prisma from "../lib/prisma";
import {CreateUserProps} from "../types/user";
import { admin } from '@prisma/client'

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
        // {
        //   phone_number: data.email
        // }
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
      // phone_number: true,
      profile: true,
    }
  })
}

export const getAdminData = async (value:string) => {
  return await prisma.admin.findFirst({
    where: {
      OR: [
        {
          email: value
        },
        {
          username: value
        },
        {
          id: value
        }
      ]
    },
    include: {
      profile: true
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


export const updateAdminData = async (data:admin, id:string) => {
  return await prisma.admin.update({
    where : {
      id
    },
    data
  })
}