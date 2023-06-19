import express = require('express');
import {
  generateJSONTokenCredentials,
  generatePasswordHash,
  generateTemporaryPassword,
  validatePassword,
} from '../helpers/utils';
import {
  adminCreateNewUser,
  createSuperAdmin,
  getSuperadminBaseData,
  getSuperadminDataById,
  getSuperadminLoginData,
} from '../datastore/superadminStore';
import { sendSignupCompleteProfileEmail } from '../messaging/email';
import { admin, admin_role, department } from '@prisma/client';
import { SuperadminCreateAdmin } from '../types/superadminTypes';
import { JsonResponse } from '../util/responses';
import { verifyUserPermission } from '../lib/auth';
import { getRoleDataBySiteId } from '../datastore/roleStore';
import { getOneAdminDataById } from '../datastore/adminStore';
import { AdminEntityObject } from '../typeorm/objectsTypes/adminObjectTypes';
import { SuperAdminEntityObject } from '../typeorm/objectsTypes/superadminObjectTypes';
import { DepartmentObjectType } from '../typeorm/objectsTypes/departmentObjectType';
import { RoleObjectType } from '../typeorm/objectsTypes/rolesObjectType';
import { getDepartmentDataBySiteId } from '../datastore/departmentStore';

const superadminRouter = express.Router();

superadminRouter.post('/super-admin/create/new_user', async (req, res) => {
  let responseMessage =
      'User With Email, Username or Phone Number Already Exist...',
    success = false;
  try {
    const data = req.body;
    data.password = generatePasswordHash(req.body.password);

    const adminUser = await createSuperAdmin(data);

    if (adminUser && typeof adminUser !== 'string') {
      sendSignupCompleteProfileEmail(
        data?.email,
        adminUser.id,
        data.first_name
      );
      responseMessage = 'Admin Created';
      success = true;
    } else {
      responseMessage = 'Error Creating Admin';
    }

    JsonResponse(res, responseMessage, success, null, 200);
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    JsonResponse(res, message, success, null, 403);
  }
});

superadminRouter.get(
  '/super-admin/get/roles_and_departments',
  async (req, res) => {
    let success = false,
      message = 'Not Authorized';
    try {
      const { siteId } = req.query;
      const verifiedUser = await verifyUserPermission(
        req?.headers?.token as string,
        ['SUPER_ADMIN', 'SITE_ADMIN', 'HOSPITAL_ADMIN']
      );

      if (!verifiedUser)
        return JsonResponse(res, 'Not Authorized', success, null, 403);

      const admin = await Promise.all([
        getOneAdminDataById(verifiedUser?.id as string),

        getSuperadminDataById(verifiedUser?.id as string),
      ]);

      if (admin[0]?.id === siteId || admin[1]) {
        const response = await Promise.all([
          getDepartmentDataBySiteId(siteId as string),

          getRoleDataBySiteId(siteId as string),
        ]);

        return JsonResponse(
          res,
          'Roles and departments data fetch successful',
          true,
          {
            department: response[0],
            role: response[1],
          },
          200
        );
      }

      return JsonResponse(res, message, success, null, 403);
    } catch (error) {
      if (error instanceof Error) message = error.message;

      return JsonResponse(res, message, success, null, 403);
    }
  }
);

superadminRouter.post('/super-admin/create/admin', async (req, res) => {
  let message = 'Unauthorized Request';

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN']
    );
    if (!verifiedUser)
      res.json({
        message,
        data: null,
        success: false,
      });

    const tempPassword = generateTemporaryPassword();
    const password = generatePasswordHash(tempPassword);

    const newAdminData = {
      ...req.body,
      password,
    };

    const newUserStatus = await adminCreateNewUser(
      newAdminData as SuperadminCreateAdmin
    );

    JsonResponse(
      res,
      newUserStatus
        ? 'Admin user created successfully'
        : 'Admin with email/username/phone number already exists',
      newUserStatus ? true : false,
      null,
      200
    );
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    JsonResponse(res, message, false, null, 403);
  }
});

superadminRouter.post('/super-admin/auth/login', async (req, res) => {
  let responseMessage = 'Incorrect Credentials',
    jwtSignData = null,
    success = false;

  try {
    const admin = await getSuperadminLoginData(req.body.email);

    if (validatePassword(req.body.password, admin?.password ?? '')) {
      const jwtData = {
        id: admin?.id as string,
        email: admin?.email as string,
        role: admin?.role as string,
      };

      jwtSignData = generateJSONTokenCredentials(
        jwtData,
        Math.floor(Date.now() / 1000) + 60 * 360
      );
      responseMessage = 'Login Successful';
      success = true;
    }

    return JsonResponse(
      res,
      responseMessage,
      success,
      {
        token: jwtSignData,
      },
      200
    );
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonResponse(res, message, success, null, 403);
  }
});

superadminRouter.get('/super-admin/profile/get-data', async (req, res) => {
  let success = false;
  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN']
    );

    if (!verifiedUser)
      return JsonResponse(res, 'Not Authorized', false, null, 401);

    const data = await getSuperadminBaseData(verifiedUser?.id as string);

    if (data) return JsonResponse(res, 'Authorized', true, data, 200);
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonResponse(res, message, success, null, 403);
  }
});

export default superadminRouter;
