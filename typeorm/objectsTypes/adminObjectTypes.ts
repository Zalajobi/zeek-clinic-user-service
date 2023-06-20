import { AdminRoles } from '../entity/enums';

export type AdminEntityObject = {
  siteId: string;
  role: AdminRoles;
  email: string;
  password: string;
  username: string;
  staff_id: string;
  id: string;
  personalInfoId: string;
  password_reset_code: string;
  password_reset_request_timestamp: Date;
  created_at: Date;
  updated_at: Date;
};
