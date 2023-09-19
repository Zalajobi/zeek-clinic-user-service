import { ProviderStatus } from '@typeorm/entity/enums';
import { ProfileInfoModelProps } from '../../types';
import { PersonalInformation } from '@typeorm/entity/personaInfo';
import { siteModelProps } from '@typeorm/objectsTypes/siteObjectTypes';

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
  personalInfoId: string;
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
  personalInfo?: PersonalInformation;
};

export interface ProviderListResponseData {
  siteId: string;
  primaryRoleId: string;
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
  id: string;
  status: ProviderStatus;
  created_at: Date;
  updated_at: Date;
  site: siteModelProps;
  personalInfo: ProfileInfoModelProps;
}
