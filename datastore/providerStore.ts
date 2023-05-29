import prisma from "../lib/prisma";
import {CreateUserProps} from "../types/user";
import {getDepartment, getProviderRole} from "../types/provider";

export const createProvider = async (data:CreateUserProps, department:string, roles:string[]) => {
  const transactions:any = []
  const isUnique = await prisma.provider.findFirst({
    where: {
      OR: [
        {
          email: data.email
        },
        {
          username: data.email
        },
        {
          profile: {
            phone_number: data.email
          }
        }
      ]
    }
  })

  if (isUnique)
    return ("Provider With Email, Username or Phone Number Already Exist...")

  // const user = await prisma.provider.create({
  //   data: {
  //     ...data,
  //     department: getDepartment(department)
  //   }
  // })
  //
  // if (user) {
  //   roles.forEach(info => {
  //     transactions.push(prisma.provider_role.create({
  //       data: {
  //         role: getProviderRole(info),
  //         provider_id: user.id
  //       }
  //     }))
  //   })
  //
  //   await prisma.$transaction(transactions)
  //   return user
  // }

  return null
}