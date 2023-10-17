import { PatientStatus } from '@typeorm/entity/enums';

import { CreateEmergencyContactsDataProps } from '@typeorm/objectsTypes/emergencyContactsObjectTypes';

export type CreatePatientsDataProps = {
  departmentId: string;
  serviceareaId: string;
  unitId: string;
  careGiverId: string;
  siteId: string;
  personalInfoId: string;
  email: string;
  password: string;
  status: PatientStatus;
  occupation: string;
  department: string;
  employer: string;
  employer_name: string;
  employer_phone: string;
  emergencyContacts?: CreateEmergencyContactsDataProps[];
};
