import {CreateProfileProps, CreateUserProps} from "../types/user";
import prisma from "../lib/prisma";
import {verifyJSONToken} from "../helpers/utils";
import {JWTDataProps} from "../types/jwt";
import {SuperadminCreateAdmin} from "../types/superadminTypes";

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
      id: true,
      first_name: true,
      phone_number: true
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
      email: true
    }
  })
}

export const adminCreateNewUser = async (data:SuperadminCreateAdmin) => {
  const {address_two, address, bio, title, dob, gender, department, zip_code, city, state, country, country_code, first_name, other_name, last_name, phone_number, call_code, ...adminData} = data
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

  if (is_unique) {
    console.log('Admin with email/username/phone number already exists')
    return false
  }

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
