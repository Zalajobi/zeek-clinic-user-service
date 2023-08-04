import { Router } from 'express';
import {
  createNewAdmin,
  getAdminAndProfileDataByEmailOrUsername,
  getAdminPrimaryLoginInformation,
  getAdminPrimaryInformationAndProfile,
  updateAdminData,
} from '../../datastore/adminStore';
import {
  generateCode,
  generateJSONTokenCredentials,
  generatePasswordHash,
  validatePassword,
} from '../../helpers/utils';
import { JsonApiResponse } from '../../util/responses';
import { verifyUserPermission } from '../../lib/auth';
import { AdminModelProps, CreateAdminApiJsonBody } from '../../types';
import { sendResetPasswordEmail } from '../../messaging/email';
import { AdminEntityObject } from '../../typeorm/objectsTypes/adminObjectTypes';

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

    return JsonApiResponse(res, message, success, null, 403);
  }
});

adminPostRequestHandler.post('/create-admin', async (req, res) => {
  let message = 'Not Authorised',
    success = false;
  const requestBody = req.body as CreateAdminApiJsonBody;

  try {
    console.log('1');
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'SITE_ADMIN']
    );
    console.log('2');

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 401);

    // const { personalInfo, ...adminData } = user;
    // console.log('3')
    // req.body.password = generatePasswordHash(generateCode());
    // console.log("4")

    // const newAdmin = await createNewAdmin(req.body as AdminModelProps);
    //
    // return JsonApiResponse(res, newAdmin.message, newAdmin.success, null, 200);
    return JsonApiResponse(res, 'newAdmin.message', true, null, 200);
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 403);
  }
});

// Send  Email With Temporary Token For Password Reset
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

      return JsonApiResponse(res, message, false, null, 403);
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
        const passwordResetCode = generateCode();
        // await twilioSendSMSMessage(
        //   user?.personalInfo?.phone ?? '',
        //   `Your Temporary Code Is ${passwordResetCode}`
        // );

        const { personalInfo, ...adminData } = user;

        const updateUser = {
          ...adminData,
          password_reset_code: passwordResetCode,
          password_reset_request_timestamp: new Date(),
        } as AdminEntityObject;

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

      return JsonApiResponse(res, message, false, null, 403);
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
        const passwordResetCode = generateCode();
        // await twilioSendAudioMessage(
        //   user?.personalInfo?.phone ?? '',
        //   `Your Temporary Code Is ${passwordResetCode}`
        // );

        const { personalInfo, ...adminData } = user;

        const updateUser = {
          ...adminData,
          password_reset_code: passwordResetCode,
          password_reset_request_timestamp: new Date(),
        } as AdminEntityObject;

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

      return JsonApiResponse(res, message, false, null, 403);
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
        const passwordResetCode = generateCode();
        // await twilioSendWhatsAppMessage(
        //   user?.personalInfo?.phone ?? '',
        //   `Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification. Thank you for taking the time to test with us.`
        // );

        const { personalInfo, ...adminData } = user;

        const updateUser = {
          ...adminData,
          password_reset_code: passwordResetCode,
          password_reset_request_timestamp: new Date(),
        } as AdminEntityObject;

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

      return JsonApiResponse(res, message, false, null, 403);
    }
  }
);

export default adminPostRequestHandler;
