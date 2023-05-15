import {admin_role, department} from '@prisma/client'

export type SuperadminCreateAdmin = {
  address_two: string;
  address: string;
  bio?: string;
  title: string;
  dob?: string;
  gender: string;
  department?: department;
  role: admin_role;
  zip_code: string;
  phone_number: string;
  city: string;
  state: string;
  country: string;
  username: string;
  other_name: string;
  last_name: string;
  first_name: string;
  email: string;
  country_code: string;
  password: string;
  call_code?: string
}