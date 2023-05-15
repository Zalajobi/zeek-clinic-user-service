import express = require("express");
import {
  generateCode,
  generateJSONTokenCredentials,
  generatePasswordHash,
  validatePassword,
  verifyJSONToken
} from "../helpers/utils";
import {getAdminBaseData, getAdminData, updateAdminData, updateAdminPassword} from "../datastore/user";
import {sendResetPasswordEmail} from "../messaging/email";
import {JWTDataProps} from "../types/jwt";
import {twilioSendAudioMessage, twilioSendSMSMessage, twilioSendWhatsAppMessage} from "../messaging/twilio";
import { admin } from '@prisma/client'

const passwordRouter = express.Router();

// Send  Email With Temporary Token For Password Reset
passwordRouter.post(`/admin/password/reset-request`, async (req, res) => {
  let responseMessage = 'User with email or username not found', success = false
  try {
    const user = await getAdminBaseData(req.body.email)
    if (user) {
      const token = generateJSONTokenCredentials({
        id: user?.id ?? '',
        email: user?.email ?? '',
        role: user?.role ?? ''
      }, Math.floor(Date.now() / 1000) + (60 * 10))

      const passwordResetEmailResponse = await sendResetPasswordEmail(user?.email ?? '', token, user?.profile?.first_name ?? '')
      if (passwordResetEmailResponse.accepted.length !== 0) {
        res.json({
          message: `Password reset link sent to ${user?.email ?? ''}`,
          data: null,
          success: true
        })
      }
    }
    else {
      res.json({
        message: responseMessage,
        data: null,
        success
      })
    }
  } catch(e){
    if (typeof e === "string") {
      res.json({
        message: e.toUpperCase(),
        data: null,
        success
      })
    } else if (e instanceof Error) {
      res.json({
        message: e.message,
        data: null,
        success
      })
    }
  }
})

passwordRouter.get('/admin/jwt_token/verify', async (req, res) => {
  let message = 'Token has expired', success = false

  try {
    const verifyToken = <JWTDataProps><unknown>verifyJSONToken(req.query.token as string)

    if (verifyToken)
      res.json({
        message: 'Token is valid',
        success: true,
        data: null
      })
  } catch(e) {
    if (typeof e === "string") {
      res.json({
        message: e.toUpperCase(),
        data: null,
        success
      })
    } else if (e instanceof Error) {
      res.json({
        message: e.message,
        data: null,
        success
      })
    }
  }

  res.json({
    message,
    success,
    data: null
  })
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
  } catch(e) {
    if (typeof e === "string") {
      res.json({
        message: e.toUpperCase(),
        data: null,
        success
      })
    } else if (e instanceof Error) {
      res.json({
        message: e.message,
        data: null,
        success
      })
    }
  }

  res.json(
    {
      message,
      success,
      data: null,
    }
  )
})

// Change Password When via password reset token
passwordRouter.put(`/admin/change_password`, async (req, res) => {
  const { authorization } = req.headers
  let message = 'Error Updating Password', success = false

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
  } catch(e) {
    if (typeof e === "string") {
      res.json({
        message: e.toUpperCase(),
        data: null,
        success
      })
    } else if (e instanceof Error) {
      res.json({
        message: e.message,
        data: null,
        success
      })
    }
  }

  res.json({
    message,
    success,
    data: null
  })
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

    res.json(
      {
        message,
        success
      }
    )
  } catch(e) {
    if (typeof e === "string") {
      res.json({
        message: e.toUpperCase(),
        data: null,
        success
      })
    } else if (e instanceof Error) {
      res.json({
        message: e.message,
        data: null,
        success
      })
    }
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

    res.json(
      {
        message,
        success
      }
    )
  } catch(e) {
    if (typeof e === "string") {
      res.json({
        message: e.toUpperCase(),
        data: null,
        success
      })
    } else if (e instanceof Error) {
      res.json({
        message: e.message,
        data: null,
        success
      })
    }
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

    res.json(
      {
        message,
        success,
        data: null,
      }
    )
  } catch(e) {
    if (typeof e === "string") {
      res.json({
        message: e.toUpperCase(),
        data: null,
        success
      })
    } else if (e instanceof Error) {
      res.json({
        message: e.message,
        data: null,
        success
      })
    }
  }
})

export default passwordRouter;
