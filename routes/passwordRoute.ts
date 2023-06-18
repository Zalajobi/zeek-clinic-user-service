import express = require('express');
import {
  generateCode,
  generateJSONTokenCredentials,
  generatePasswordHash,
  validatePassword,
  verifyJSONToken,
} from '../helpers/utils';
import {
  getAdminBaseData,
  getAdminData,
  updateAdminData,
  updateAdminPassword,
} from '../datastore/userStore';
import { sendResetPasswordEmail } from '../messaging/email';
import { JWTDataProps } from '../types/jwt';
import {
  twilioSendAudioMessage,
  twilioSendSMSMessage,
  twilioSendWhatsAppMessage,
} from '../messaging/twilio';
import { JsonResponse } from '../util/responses';

const passwordRouter = express.Router();

// Verify Admin Email, Username data, and send code to user WhatsApp
passwordRouter.post(
  `/admin/password/reset/user_verification/whatsApp`,
  async (req, res) => {
    let message = 'Passcode is send to the admin registered phone number',
      success = true;

    try {
      const user = await getAdminData(req.body.email);

      if (user) {
        const passwordResetCode = generateCode();
        await twilioSendWhatsAppMessage(
          user?.profile?.phone_number ?? '',
          `Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification. Thank you for taking the time to test with us.`
        );

        const updateUser = {
          ...user,
          password_reset_code: passwordResetCode,
          password_reset_request_timestamp: new Date(),
        };

        const updatedUser = await updateAdminData(updateUser, user.id);

        if (!updatedUser) {
          message = 'Error occurred while sending passcode';
          success = false;
        }
      } else {
        message = 'No User is registered with the provided Email or Username';
        success = false;
      }

      JsonResponse(res, message, success, null, 200);
    } catch (error) {
      let message = 'Something Went Wrong';
      if (error instanceof Error) message = error.message;

      JsonResponse(res, message, false, null, 403);
    }
  }
);

export default passwordRouter;
