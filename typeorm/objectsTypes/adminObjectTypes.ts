import { AdminRoles } from '@typeorm/entity/entity/enums';

export type AdminModelProps = {
  siteId: string;
  role: AdminRoles;
  email: string;
  password: string;
  username: string;
  staff_id: string;
  password_reset_code?: string;
  password_reset_request_timestamp?: Date;
  // personalInfoId?: string
};
