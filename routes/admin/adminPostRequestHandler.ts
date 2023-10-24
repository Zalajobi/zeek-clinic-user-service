import { Router } from 'express';
import {
  generateTemporaryPassCode,
  generateJSONTokenCredentials,
  generatePasswordHash,
  validatePassword,
} from '@helpers/utils';
import { JsonApiResponse } from '@util/responses';
import { verifyUserPermission } from '@lib/auth';
import { sendResetPasswordEmail } from '@messaging/email';
import { AdminModelProps } from '@typeorm/objectsTypes/adminObjectTypes';
import { emitNewEvent } from '@messaging/rabbitMq';
import { CREATE_ADMIN_QUEUE_NAME } from '@util/constants';
import {
  getAdminAndProfileDataByEmailOrUsername,
  getAdminPrimaryInformationAndProfile,
  getAdminPrimaryLoginInformation,
} from '@datastore/admin/adminGetStore';
import { CreateAdminApiJsonBody, ProfileInfoModelProps } from '@typeDesc/index';
import { createNewAdmin } from '@datastore/admin/adminPostStore';
import { updateAdminData } from '@datastore/admin/adminPutStore';

const adminPostRequestHandler = Router();

adminPostRequestHandler.post(`/login`, async (req, res) => {
  let responseMessage = 'Incorrect Credentials',
    jwtSignData = null,
    success = false;
  try {
    const { email, password, rememberMe } = req.body;

    const admin = await getAdminPrimaryLoginInformation(email as string);

    if (
      validatePassword(password as string, admin?.password ?? ('' as string))
    ) {
      const jwtData = {
        id: admin?.id ?? '',
        email: admin?.email ?? '',
        role: admin?.role ?? '',
        siteId: admin?.siteId,
      };

      // if remember me, set the date expiration of the jwt to 1 day
      jwtSignData = generateJSONTokenCredentials(
        jwtData,
        rememberMe
          ? Math.floor(Date.now() / 1000) + 240 * 360
          : Math.floor(Date.now() / 1000) + 60 * 360
      );
      responseMessage = 'Login Successful';
      success = true;
    }

    return JsonApiResponse(
      res,
      responseMessage,
      success,
      {
        token: jwtSignData,
        role: admin?.role,
      },
      200
    );
  } catch (error) {
    let message = 'Not Authorized';
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 500);
  }
});

adminPostRequestHandler.post('/create-admin', async (req, res) => {
  let message = 'Not Authorised',
    success = false;
  const requestBody = req.body as CreateAdminApiJsonBody;

  try {
    const { siteId, role, email, username, staff_id, ...profileInfoData } =
      requestBody;
    const {
      first_name,
      last_name,
      middle_name,
      country,
      state,
      city,
      phone,
      zip_code,
      religion,
      gender,
      dob,
      title,
      address,
      address_two,
      profile_pic,
      marital_status,
      ...adminData
    } = requestBody;

    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'SITE_ADMIN']
    );

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 401);

    const tempPassword = generateTemporaryPassCode();
    adminData.password = generatePasswordHash(tempPassword);

    const newAdmin = await createNewAdmin(
      adminData as AdminModelProps,
      profileInfoData as ProfileInfoModelProps
    );

    if (newAdmin.success as boolean) {
      await emitNewEvent(CREATE_ADMIN_QUEUE_NAME, {
        email: requestBody.email,
        firstName: requestBody.first_name,
        lastName: requestBody.last_name,
        tempPassword: tempPassword,
        userName: requestBody.username,
      });
    }

    return JsonApiResponse(
      res,
      newAdmin.message,
      newAdmin.success as boolean,
      null,
      200
    );
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 500);
  }
});

// Send Email With Temporary Token For Password Reset
adminPostRequestHandler.post(
  `/password/request-password/reset`,
  async (req, res) => {
    let responseMessage = 'User with email or username not found',
      success = false;
    try {
      const user = await getAdminPrimaryInformationAndProfile(req.body.email);
      if (user) {
        const token = generateJSONTokenCredentials(
          {
            id: user?.id ?? '',
            email: user?.email ?? '',
            role: user?.role ?? '',
          },
          Math.floor(Date.now() / 1000) + 60 * 10
        );

        const passwordResetEmailResponse = await sendResetPasswordEmail(
          user?.email ?? '',
          token,
          user?.personalInfo?.first_name ?? ''
        );
        if (passwordResetEmailResponse.accepted.length !== 0) {
          return JsonApiResponse(
            res,
            `Password reset link sent to ${user?.email ?? ''}`,
            true,
            null,
            401
          );
        }
      } else {
        return JsonApiResponse(res, responseMessage, success, null, 401);
      }
    } catch (error) {
      let message = 'Something Went Wrong';
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, false, null, 500);
    }
  }
);

// Verify Admin Email, Username data, and send SMS to user number
adminPostRequestHandler.post(
  `/password/reset/user_verification/sms`,
  async (req, res) => {
    let message = 'Passcode is send to the admin registered phone number',
      success = true;

    const { email } = req.body;

    try {
      const user = await getAdminAndProfileDataByEmailOrUsername(
        email as string
      );

      if (user) {
        const passwordResetCode = generateTemporaryPassCode();
        // await twilioSendSMSMessage(
        //   user?.personalInfo?.phone ?? '',
        //   `Your Temporary Code Is ${passwordResetCode}`
        // );

        const { personalInfo, ...adminData } = user;

        const updateUser = {
          ...adminData,
          password_reset_code: passwordResetCode,
          password_reset_request_timestamp: new Date(),
        } as AdminModelProps;

        const updatedUser = await updateAdminData(user.id, updateUser);

        if (!updatedUser) {
          message = 'Error occurred while sending passcode';
          success = false;
        }
      } else {
        message = 'No User is registered with the provided Email or Username';
        success = false;
      }

      return JsonApiResponse(res, message, success, null, 200);
    } catch (error) {
      let message = 'Something Went Wrong';
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, false, null, 500);
    }
  }
);

// Verify Admin Email, Username data, and Call user number
adminPostRequestHandler.post(
  `/password/reset/user_verification/direct-call`,
  async (req, res) => {
    let message = 'Passcode is send to the admin registered phone number',
      success = true;

    const { email } = req.body;

    try {
      const user = await getAdminAndProfileDataByEmailOrUsername(
        email as string
      );

      if (user) {
        const passwordResetCode = generateTemporaryPassCode();
        // await twilioSendAudioMessage(
        //   user?.personalInfo?.phone ?? '',
        //   `Your Temporary Code Is ${passwordResetCode}`
        // );

        const { personalInfo, ...adminData } = user;

        const updateUser = {
          ...adminData,
          password_reset_code: passwordResetCode,
          password_reset_request_timestamp: new Date(),
        } as AdminModelProps;

        const updatedUser = await updateAdminData(user.id, updateUser);

        if (!updatedUser) {
          message = 'Error occurred while sending passcode';
          success = false;
        }
      } else {
        message = 'No User is registered with the provided Email or Username';
        success = false;
      }

      return JsonApiResponse(res, message, success, null, 200);
    } catch (error) {
      let message = 'Something Went Wrong';
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, false, null, 500);
    }
  }
);

// Verify Admin Email, Username data, and send code to user WhatsApp
adminPostRequestHandler.post(
  `/password/reset/user_verification/whatsApp`,
  async (req, res) => {
    let message = 'Passcode is send to the admin registered phone number',
      success = true;

    const { email } = req.body;

    try {
      const user = await getAdminAndProfileDataByEmailOrUsername(
        email as string
      );

      if (user) {
        const passwordResetCode = generateTemporaryPassCode();
        // await twilioSendWhatsAppMessage(
        //   user?.personalInfo?.phone ?? '',
        //   `Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification. Thank you for taking the time to test with us.`
        // );

        const { personalInfo, ...adminData } = user;

        const updateUser = {
          ...adminData,
          password_reset_code: passwordResetCode,
          password_reset_request_timestamp: new Date(),
        } as AdminModelProps;

        const updatedUser = await updateAdminData(user.id, updateUser);

        if (!updatedUser) {
          message = 'Error occurred while sending passcode';
          success = false;
        }
      } else {
        message = 'No User is registered with the provided Email or Username';
        success = false;
      }

      return JsonApiResponse(res, message, success, null, 200);
    } catch (error) {
      let message = 'Something Went Wrong';
      if (error instanceof Error) message = error.message;

      return JsonApiResponse(res, message, false, null, 500);
    }
  }
);

export default adminPostRequestHandler;
