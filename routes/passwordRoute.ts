import express = require("express");
import {
  generateCode,
  generateJSONTokenCredentials,
  generatePasswordHash,
  validatePassword,
  verifyJSONToken
} from "../helpers/utils";
import {getAdminBaseData, getAdminData, updateAdminData, updateAdminPassword} from "../datastore/userStore";
import {sendResetPasswordEmail} from "../messaging/email";
import {JWTDataProps} from "../types/jwt";
import {twilioSendAudioMessage, twilioSendSMSMessage, twilioSendWhatsAppMessage} from "../messaging/twilio";
import {JsonResponse} from "../util/responses";

const passwordRouter = express.Router();

passwordRouter.get('/admin/jwt_token/verify', async (req, res) => {
  let message = 'Token has expired', success = false

  try {
    const verifyToken = <JWTDataProps><unknown>verifyJSONToken(req.query.token as string)

    if (verifyToken)
      JsonResponse(res, 'Token is valid', true, null, 200)
    else
      JsonResponse(res, 'Token is invalid', false, null, 401)
  } catch(error) {
    let message = 'Something Went Wrong'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, false, null, 403)
  }
})

// Verify Token with JWT and update Password
passwordRouter.put(`/admin/reset_password`, async (req, res) => {
  let message = 'Token has expired', success = false

  try {
    const verifyToken = <JWTDataProps><unknown>verifyJSONToken(req.body.token as string)

    if (verifyToken) {
      const password = generatePasswordHash(req.body.password)

      const updatedData = await updateAdminPassword(verifyToken?.id ?? '', password)
      message = "Password Updated"
      success = true
    }

    JsonResponse(res, message, success, null, 200)
  } catch(error) {
    let message = 'Something Went Wrong'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, false, null, 403)
  }
})

// Change Password When via password reset token
passwordRouter.put(`/admin/change_password`, async (req, res) => {
  const { authorization } = req.headers
  let message = 'Error Updating Password';

  try {
    const verifyToken = <JWTDataProps><unknown>verifyJSONToken(authorization as string)

    if (verifyToken) {
      const admin = await getAdminBaseData(verifyToken?.id ?? '')

      if(validatePassword(req.body?.old_password, admin?.password ?? '')) {
        const password = generatePasswordHash(req.body.new_password)

        if (await updateAdminPassword(verifyToken?.id ?? '', password))
          message = 'Password Updated'
      }
    }

    JsonResponse(res, message, true, null, 200)
  } catch(error) {
    let message = 'Something Went Wrong'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, false, null, 403)
  }
})

// Verify Admin Email, Username data, and send SMS to user number
passwordRouter.post(`/admin/password/reset/user_verification/sms`, async (req, res) => {
  let message = 'Passcode is send to the admin registered phone number', success = true

  try {
    const user = await getAdminData(req.body.email)

    if (user) {
      const passwordResetCode = generateCode()
      await twilioSendSMSMessage(user?.profile?.phone_number ?? '', `Your Temporary Code Is ${passwordResetCode}`)

      const updateUser = {
        ...user,
        password_reset_code: passwordResetCode,
        password_reset_request_timestamp: new Date()
      }

      const updatedUser = await updateAdminData(updateUser, user.id)

      if (!updatedUser) {
        message = "Error occurred while sending passcode"
        success = false
      }
    } else {
      message = "No User is registered with the provided Email or Username"
      success = false
    }

    JsonResponse(res, message, success, null, 200)
  } catch(error) {
    let message = 'Something Went Wrong'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, false, null, 403)
  }
})

// Verify Admin Email, Username data, and Call user number
passwordRouter.post(`/admin/password/reset/user_verification/direct-call`, async (req, res) => {
  let message = 'Passcode is send to the admin registered phone number', success = true

  try {
    const user = await getAdminData(req.body.email)

    if (user) {
      const passwordResetCode = generateCode()
      await twilioSendAudioMessage(user?.profile?.phone_number ?? '', `Your Temporary Code Is ${passwordResetCode}`)

      const updateUser = {
        ...user,
        created_at: new Date(user?.created_at),
        password_reset_code: passwordResetCode,
        password_reset_request_timestamp: new Date()
      }

      const updatedUser = await updateAdminData(updateUser, user.id)

      if (!updatedUser) {
        message = "Error occurred while sending passcode"
        success = false
      }
    } else {
      message = "No User is registered with the provided Email or Username"
      success = false
    }

    JsonResponse(res, message, success, null, 200)
  } catch(error) {
    let message = 'Something Went Wrong'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, false, null, 403)
  }
})

// Verify Admin Email, Username data, and send code to user WhatsApp
passwordRouter.post(`/admin/password/reset/user_verification/whatsApp`, async (req, res) => {
  let message = 'Passcode is send to the admin registered phone number', success = true

  try {
    const user = await getAdminData(req.body.email)

    if (user) {
      const passwordResetCode = generateCode()
      await twilioSendWhatsAppMessage(user?.profile?.phone_number ?? '', `Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification. Thank you for taking the time to test with us.`)

      const updateUser = {
        ...user,
        password_reset_code: passwordResetCode,
        password_reset_request_timestamp: new Date()
      }

      const updatedUser = await updateAdminData(updateUser, user.id)

      if (!updatedUser) {
        message = "Error occurred while sending passcode"
        success = false
      }
    } else {
      message = "No User is registered with the provided Email or Username"
      success = false
    }

    JsonResponse(res, message, success, null, 200)
  } catch(error) {
    let message = 'Something Went Wrong'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, false, null, 403)
  }
})

export default passwordRouter;
