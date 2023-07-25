import { Router } from 'express';
import { verifyUserPermission } from '../../lib/auth';
import { JsonApiResponse } from '../../util/responses';
import {
  createProviderRequestBody,
  profileInfoModelProps,
  ProviderModelProps,
} from '../../types';
import { generatePasswordHash } from '../../helpers/utils';
import { adminCreateNewProvider } from '../../datastore/providerStore';

const providersPostRequestHandler = Router();

providersPostRequestHandler.post(
  '/admin/create-new/provider',
  async (req, res) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const verifiedUser = await verifyUserPermission(
        req?.headers?.token as string,
        [
          'SUPER_ADMIN',
          'HOSPITAL_ADMIN',
          'SITE_ADMIN',
          'ADMIN',
          'HUMAN_RESOURCES',
        ] // Remove HUMAN_RESOURCES later, this is for testing purpose for July 23, 2023 session 8AM - 2PM
      );

      const data = req.body as createProviderRequestBody;

      // const {email, appointments, department, is_consultant, is_specialist, ...profileInfoData} = data;
      // const {first_name, last_name, middle_name, relationship_status, religion, country, state, city, dob, phone ,...providersData} = data
      const providersData: ProviderModelProps = {
        appointments: data.appointments,
        departmentId: data.department,
        is_consultant: data.is_consultant,
        is_specialist: data.is_specialist,
        primaryRoleId: data.role,
        serviceareaId: data.serviceArea,
        siteId: data.siteId,
        staff_id: data.staff_id,
        unitId: data.unit,
        username: data.username,
        email: data.email,
        password: generatePasswordHash(data.password),
      };

      const newAdmin = await adminCreateNewProvider(providersData, data.phone);

      // profileInfoModelProps

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 200);
    } catch (error) {
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, success, null, 401);
    }
  }
);

export default providersPostRequestHandler;
