import { AdminRoles, MartialStatus } from '../typeorm/entity/enums';

export type loginProps = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type hospitalModelProps = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state: string;
  country: string;
  logo?: string;
  country_code: string;
  zip_code: string;
};

export type siteModelProps = {
  address: string;
  hospital_id: string;
  name: string;
  email: string;
  city: string;
  state: string;
  country: string;
  logo?: string;
  time_zone?: string;
  phone: string;
  zip_code?: string;
  is_private?: boolean;
  has_appointment?: boolean;
  has_caregiver?: boolean;
  has_clinical?: boolean;
  has_doctor?: boolean;
  has_emergency?: boolean;
  has_laboratory?: boolean;
  has_medical_supply?: boolean;
  has_nursing?: boolean;
  has_inpatient?: boolean;
  has_outpatient?: boolean;
  has_pharmacy?: boolean;
  has_physical_therapy?: boolean;
  has_procedure?: boolean;
  has_radiology?: boolean;
  has_unit?: boolean;
  has_vital?: boolean;
  has_wallet?: boolean;
  totalSites: number;
};

export type roleModelProps = {
  siteId: string;
  name: string;
  description: string;
};

export type departmentModelProps = {
  siteId: string;
  name: string;
  description: string;
};

export type CreateAdminApiJsonBody = AdminModelProps & ProfileInfoModelProps;

export type AdminModelProps = {
  siteId: string;
  role: AdminRoles;
  email: string;
  password: string;
  username: string;
  staff_id: string;
};

export type ProfileInfoModelProps = {
  phone?: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  title: string;
  gender: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  profile_pic?: string;
  religion?: string;
  providerId?: string;
  adminId?: string;
  marital_status?: MartialStatus;
  profilePic?: string;
  patientId?: string;
};

export type createProviderRequestBody = {
  title: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  gender: string;
  dob: string;
  email: string;
  password: string;
  staff_id: string;
  siteId: string;
  username: string;
  relationship_status: string;
  religion: string;
  department: string;
  role: string;
  serviceArea: string;
  unit: string;
  country: string;
  state: string;
  city?: string;
  zip_code: string;
  phone: string;
  is_consultant: boolean;
  is_specialist: boolean;
  appointments: boolean;
  address: string;
  profilePic: string;
};

export type ProviderModelProps = {
  siteId: string;
  primaryRoleId: string;
  personalInfoId?: string;
  departmentId: string;
  serviceareaId: string;
  unitId: string;
  email: string;
  password: string;
  username: string;
  staff_id: string;
  is_consultant: boolean;
  is_specialist: boolean;
  appointments: boolean;
};
