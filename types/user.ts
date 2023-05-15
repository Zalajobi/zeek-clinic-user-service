import { admin_role, admin, profile } from '@prisma/client'
import {Jsonify} from "type-fest";

export interface CreateUserProps {
  email: string
  phone_number?: string
  password: string
  username: string
  first_name: string
  last_name: string
  role: admin_role
}

export interface CreateProfileProps {
  gender: string
  dob: string
  title: string
  bio: string
  address: string
  address_two?: string
  state: string
  city: string
  zip_code: string
  country: string
  country_code?: string
}


export interface JWTDataProps {
  id: string
  role?: string
  email?: string
}


export type AdminType = Jsonify<admin>

export type ProfileType = Jsonify<profile>

export type AdminDataProp = Jsonify<
  admin & {
  profile: ProfileType
}
  >
