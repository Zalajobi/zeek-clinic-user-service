import prisma from "../lib/prisma";
import {CreateUserProps} from "../types/user";
import {verifyJSONToken} from "../helpers/utils";
import {JWTDataProps} from "../types/jwt";
import {SuperadminCreateAdmin} from "../types/superadminTypes";
import {superAdminRepo} from "../typeorm/repositories/superAdminRepository";
import {AppDataSource} from "../data-source";
import {SuperAdmin} from "../typeorm/entity/superAdmin";

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

export const getSuperadminLoginData = async (value:string) => {
  const superAdminRepository = superAdminRepo()

  return await superAdminRepository.findOne({
    where: [
      {
        email: value
      },

      {
        username: value
      }
    ],

    select: {
      email: true,
      id: true,
      password: true,
      role: true
    }
  })
}

export const getSuperadminBaseData = async (value:string) => {
  return await prisma.super_admin.findFirst({
    where: {
      OR: [
        {
          email: value
        },
        {
          username: value
        },
        {
          phone_number: value
        },
        {
          id: value
        }
      ]
    },
    select: {
      id: true,
      email: true,
      username: true,
      phone_number: true,
      first_name: true,
      last_name: true,
      other_name: true,
    }
  })
}

export const verifySuperadminUser = async (token:string) => {
  const { id } = await <JWTDataProps><unknown>verifyJSONToken(token)

  return await prisma.super_admin.findFirst({
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

export const adminCreateNewUser = async (data:SuperadminCreateAdmin) => {
  const {address_two, address, bio, title, dob, gender, department, zip_code, city, state, country, country_code, first_name, other_name, last_name, phone_number, call_code, profile_img_url, ...adminData} = data
  const {email, username, password, role, ...profileData} = data
  profileData.phone_number = `+${data.call_code}${data.phone_number}`

  const is_unique = await prisma.admin.findFirst({
    where: {
      OR: [
        {
          profile: {
            phone_number: profileData.phone_number
          }
        },
        {
          email: data?.email
        },
        {
          username: data?.username
        }
      ]
    }
  })

  if (is_unique)
    return false

  const admin = await prisma.admin.create({
    data: adminData
  })

  delete profileData['department']
  delete profileData['call_code']
  delete profileData['dob']

  await prisma.profile.create({
    data: {
      ...profileData,
      admin_id: admin?.id,
      dob: data?.dob ? new Date(data?.dob as string) : ''
    }
  })

  return true;
}
