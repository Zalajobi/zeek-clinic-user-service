import { PatientStatus } from '../entity/enums';
import { CreateEmergencyContactsDataProps } from './emergencyContactsObjectTypes';

export type CreatePatientsDataProps = {
  departmentId: string;
  serviceareaId: string;
  unitId: string;
  email: string;
  password: string;
  status: PatientStatus;
  occupation: string;
  department: string;
  siteId: string;
  personalInfoId: string;
  employer: string;
  employer_name: string;
  employer_phone: string;
  emergencyContacts?: CreateEmergencyContactsDataProps[];
};
