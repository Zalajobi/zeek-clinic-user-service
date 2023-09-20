import { Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { ProfileInfoModelProps } from '../../types';
import {
  generateTemporaryPassCode,
  generatePasswordHash,
} from '@helpers/utils';
// @ts-ignore
import { adminCreateNewProvider } from '@datastore/providerStore';
import { MartialStatus } from '@typeorm/entity/enums';
import { emitNewEvent } from '@messaging/rabbitMq';
import { CREATE_ADMIN_QUEUE_NAME } from '@util/constants';
import {
  createProviderRequestBody,
  ProviderModelProps,
} from '@typeorm/objectsTypes/providersObjectTypes';

const providersPostRequestHandler = Router();

providersPostRequestHandler.post(
  '/admin/create-new/provider',
  async (req, res) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const data = req.body as createProviderRequestBody;
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

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 200);

      const tempPassword = generateTemporaryPassCode();

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
        password: generatePasswordHash(tempPassword),
        personalInfoId: '',
      };

      const personalInfoData: ProfileInfoModelProps = {
        address: data?.address ?? '',
        city: data?.city ?? '',
        country: data.country ?? '',
        dob: data?.dob ?? '',
        first_name: data?.first_name ?? '',
        gender: data.gender ?? '',
        last_name: data.last_name ?? '',
        middle_name: data.middle_name ?? '',
        state: data.state ?? '',
        title: data.title ?? '',
        zip_code: data.zip_code ?? '',
        marital_status: data?.relationship_status as MartialStatus,
        phone: data?.phone ?? '',
        profile_pic: data?.profilePic ?? '',
        religion: data?.religion ?? '',
        // providerId: '',
      };

      const newAdmin = await adminCreateNewProvider(
        providersData,
        personalInfoData,
        data.phone
      );

      if (newAdmin.success as boolean) {
        await emitNewEvent(CREATE_ADMIN_QUEUE_NAME, {
          email: providersData.email,
          firstName: personalInfoData.first_name,
          lastName: personalInfoData.last_name,
          tempPassword: tempPassword,
          userName: providersData.username,
        });
      }

      return JsonApiResponse(
        res,
        <string>newAdmin?.message,
        <boolean>newAdmin?.success,
        null,
        200
      );
    } catch (error) {
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, success, null, 401);
    }
  }
);

export default providersPostRequestHandler;
