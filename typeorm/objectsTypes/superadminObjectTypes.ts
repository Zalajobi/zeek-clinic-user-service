import { AdminRoles } from '../entity/enums';

export type SuperAdminEntityObject = {
  id: string;
  email: string;
  username: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  other_name?: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  role: AdminRoles;
};
