export interface CreateUserProps {
  email: string
  phone_number?: string
  password: string
  username: string
  first_name: string
  last_name: string
}

export interface JWTDataProps {
  id: string
  role?: string
  email?: string
}

