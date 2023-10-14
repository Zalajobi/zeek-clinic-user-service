import { Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { createAndUpdateProviderRequestBody } from '@typeorm/objectsTypes/providersObjectTypes';
import { verifyUserPermission } from '@lib/auth';
import { generatePasswordHash } from '@helpers/utils';
// @ts-ignore
import { purgeObjectOfNullOrEmptyValues } from '@util/index';
import * as console from 'console';
import { MartialStatus } from '@typeorm/entity/enums';
import { updateProviderDetails } from '@datastore/providerStore';

const providersPutRequestHandler = Router();

providersPutRequestHandler.put('/update/:id/:siteId', async (req, res) => {
  let message = 'Not Authorised',
    success = false,
    encryptedPass = '';
  const { siteId, id } = req.params;

  try {
    const data = req.body as createAndUpdateProviderRequestBody;
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

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 401);

    if (data.password) encryptedPass = generatePasswordHash(data.password);

    const providerData = purgeObjectOfNullOrEmptyValues({
      appointments: data?.appointments,
      email: data?.email,
      is_consultant: data?.is_consultant,
      is_specialist: data?.is_specialist,
      password: encryptedPass,
      staff_id: data?.staff_id,
      username: data?.username,
      departmentId: data.department,
      primaryRoleId: data.role,
      serviceareaId: data.serviceArea ?? data.servicearea ?? '',
      unitId: data.unit,
    });

    const personalInfoData = purgeObjectOfNullOrEmptyValues({
      address: data.address,
      address_two: data.address_two,
      city: data.city,
      country: data.country,
      dob: data?.dob ? new Date(data?.dob) : '',
      first_name: data?.first_name,
      gender: data.gender,
      last_name: data.last_name,
      middle_name: data.middle_name,
      state: data.state,
      title: data.title,
      zip_code: data.zip_code,
      marital_status: data?.relationship_status as MartialStatus,
      phone: data?.phone,
      profile_pic: data?.profilePic,
      religion: data?.religion,
    });

    const updateProviderResponse = await updateProviderDetails(
      id,
      siteId,
      providerData,
      personalInfoData
    );

    return JsonApiResponse(
      res,
      updateProviderResponse.message,
      <boolean>updateProviderResponse.success,
      null,
      updateProviderResponse.success ? 201 : 500
    );
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(
      res,
      'Provider Information Updated Successfully',
      true,
      null,
      500
    );
  }
});

export default providersPutRequestHandler;
