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
import {twilioSendSMSMessage} from "../messaging/twilio";
import { admin } from '@prisma/client'

// type AdminUserType = Jsonify<admin>


const passwordRouter = express.Router();

// Send  Email With Temporary Token For Password Reset
passwordRouter.post(`/admin/password/reset-request`, async (req, res) => {
  const user = await getAdminBaseData(req.body.email)
  const token = generateJSONTokenCredentials({
    id: user?.id ?? '',
    email: user?.email ?? '',
    role: user?.role ?? ''
  }, Math.floor(Date.now() / 1000) + (60 * 10))

  const passwordResetEmailResponse = await sendResetPasswordEmail(user?.email ?? '', token, user?.first_name ?? '')
  if (passwordResetEmailResponse.accepted.length !== 0)
    res.send("Check Mail To Reset Password...")
  else
    res.send('Error Occurred While Sending Email. Try  Again....')
})

// Verify Token with JWT and update Password
passwordRouter.put(`/admin/reset_password`, async (req, res) => {
  const verifyToken = <JWTDataProps><unknown>verifyJSONToken(req.query.token as string)

  if (verifyToken) {
    const password = generatePasswordHash(req.body.password)

    const updatedData = await updateAdminPassword(verifyToken?.id ?? '', password)
    console.log(updatedData)
  }

  res.json(verifyToken)
})

// Change Password When User is Logged In
passwordRouter.put(`/admin/change_password`, async (req, res) => {
  const { authorization } = req.headers
  let message = 'Error Updating Password'

  const verifyToken = <JWTDataProps><unknown>verifyJSONToken(authorization as string)

  if (verifyToken) {
    const admin = await getAdminBaseData(verifyToken?.id ?? '')

    if(validatePassword(req.body?.old_password, admin?.password ?? '')) {
      const password = generatePasswordHash(req.body.new_password)

      if (await updateAdminPassword(verifyToken?.id ?? '', password))
        message = 'Password Updated'
    }
  }

  res.json(
    message
  )
})

// Verify Admin Email, Username data, and send
passwordRouter.post(`/admin/password/reset/user_verification/sms-code`, async (req, res) => {
  let message = 'Passcode is send to the admin registered phone number', success = true
  const user = await getAdminData(req.body.email) as admin

  if (user) {
    const passwordResetCode = generateCode()
    await twilioSendSMSMessage(user?.phone_number ?? '', `Your Temporary Code Is ${passwordResetCode}`)

    const updateUser = {
      ...user,
      password_reset_code: passwordResetCode,
      password_reset_request_timestamp: new Date()
    }

    const updatedUser = await updateAdminData(updateUser, user.id)

    if (!updateUser) {
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
})

export default passwordRouter;
