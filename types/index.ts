import { MartialStatus } from '@typeorm/entity/enums';

import { AdminModelProps } from '@typeorm/objectsTypes/adminObjectTypes';

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

export type roleModelProps = {
  plan: boolean;
  nursing: boolean;
  charts: boolean;
  upload: boolean;
  refer_outpx: boolean;
  referral: boolean;
  consult: boolean;
  radiology: boolean;
  clerking: boolean;
  dental: boolean;
  logs: boolean;
  review: boolean;
  time_of_death: boolean;
  discharge: boolean;
  move_patient: boolean;
  transfer_patient: boolean;
  admit_patient: boolean;
  med_supply: boolean;
  vitals: boolean;
  appointment: boolean;
  lab_test: boolean;
  procedure: boolean;
  note: boolean;
  prescription: boolean;
  siteId: string;
  name: string;
  description: string;
};

export type departmentModelProps = {
  siteId: string;
  name: string;
  description: string;
};

export type unitModelProps = {
  siteId: string;
  name: string;
  description: string;
  total_beds: number;
  occupied_beds?: number;
};

export type CreateAdminApiJsonBody = AdminModelProps & ProfileInfoModelProps;

export type ProfileInfoModelProps = {
  phone?: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  title: string;
  gender: string;
  dob: string;
  address: string;
  address_two?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  profile_pic?: string;
  religion?: string;
  // providerId?: string;
  // adminId?: string;
  marital_status?: MartialStatus;
  profilePic?: string;
  patientId?: string;
};
