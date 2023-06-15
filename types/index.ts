export type CreateHospitalProps = {
  name: string
  email:  string
  phone: string
  address: string
  city?: string
  state: string
  country: string
  logo?: string
  country_code: string
  zip_code: string
}


export type createSiteProps = {
  address: string
  hospital_id: string
  name: string
  email: string
  city: string
  state: string
  country: string
  logo?: string
  time_zone?: string
  phone: string
  zip_code?: string
  is_private?: boolean
  has_appointment?: boolean
  has_caregiver?: boolean
  has_clinical?: boolean
  has_doctor?: boolean
  has_emergency?: boolean
  has_laboratory?: boolean
  has_medical_supply?: boolean
  has_nursing?: boolean
  has_inpatient?: boolean
  has_outpatient?: boolean
  has_pharmacy?: boolean
  has_physical_therapy?: boolean
  has_procedure?: boolean
  has_radiology?: boolean
  has_unit?: boolean
  has_vital?: boolean
  has_wallet?: boolean
}

export type createRoleProps = {
  siteId: string
  // hospitalId: string
  name: string
  description: string
}