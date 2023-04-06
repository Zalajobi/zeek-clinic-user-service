import express = require("express");
import {generateJSONTokenCredentials, generatePasswordHash, validatePassword, verifyJSONToken} from "../helpers/utils";
import {getAdminBaseData, updateAdminPassword} from "../datastore/user";
import {sendResetPasswordEmail} from "../messaging/email";
import {JWTDataProps} from "../types/jwt";


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

export default passwordRouter;
