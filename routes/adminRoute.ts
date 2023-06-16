import express = require("express");
import {JsonResponse} from "../util/responses";
import {adminModelProps} from "../types";
import {verifyUserPermission} from "../lib/auth";
import {generateJSONTokenCredentials, generatePasswordHash, validatePassword, verifyJSONToken} from "../helpers/utils";
import {
  createNewAdmin, getAdminBaseDataAndProfileDataByAdminId,
  getAdminPrimaryInformation,
  getAdminPrimaryInformationAndProfile, updateAdminPasswordByAdminId
} from "../datastore/adminStore";
import {sendResetPasswordEmail} from "../messaging/email";
import {JWTDataProps} from "../types/jwt";

const adminRouter = express.Router();

adminRouter.post('/admin/create', async (req, res) => {
  let message = 'Not Authorised', success = false

  try {
    const verifiedUser = await verifyUserPermission(req?.headers?.token as string, ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'SITE_ADMIN'])

    if (!verifiedUser)
      return JsonResponse(res, message, success, null, 401)
    req.body.password = generatePasswordHash(req.body.password)

    const newAdmin = await createNewAdmin(req.body as adminModelProps)

    return JsonResponse(res, newAdmin.message, newAdmin.success, null, 200)

  } catch(error) {
    if (error instanceof Error)
      message = error.message

    return JsonResponse(res, message, success, null, 403)
  }
})


adminRouter.post(`/admin/login`, async (req, res) => {
  let responseMessage = 'Incorrect Credentials', jwtSignData = null, success = false
  try {
    const { email, password, rememberMe } = req.body

    const admin = await getAdminPrimaryInformation(email as string)

    console.log(Math.floor(Date.now() / 1000) + (240 * 360))

    if (validatePassword(password as string, admin?.password ?? '' as string)) {
      const jwtData = {
        id: admin?.id ?? '',
        email: admin?.email ?? '',
        role: admin?.role ?? ''
      }

      // if remember me, set the date expiration of the jwt to 1 day
      jwtSignData = generateJSONTokenCredentials(
        jwtData,
        rememberMe ?
          Math.floor(Date.now() / 1000) + (240 * 360) :
          Math.floor(Date.now() / 1000) + (60 * 360)
      )
      responseMessage= 'Login Successful'
      success = true
    }

    JsonResponse(res, responseMessage, success, {
      token: jwtSignData
    }, 200)
  } catch(error) {
    let message = 'Not Authorized'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, success, null, 403)
  }
})

// Send  Email With Temporary Token For Password Reset
adminRouter.post(`/admin/password/request-password/reset`, async (req, res) => {
  let responseMessage = 'User with email or username not found', success = false
  try {
    const user = await getAdminPrimaryInformationAndProfile(req.body.email)
    if (user) {
      const token = generateJSONTokenCredentials({
        id: user?.id ?? '',
        email: user?.email ?? '',
        role: user?.role ?? ''
      }, Math.floor(Date.now() / 1000) + (60 * 10))

      const passwordResetEmailResponse = await sendResetPasswordEmail(user?.email ?? '', token, user?.personalInfo?.first_name ?? '')
      if (passwordResetEmailResponse.accepted.length !== 0) {
        JsonResponse(res, `Password reset link sent to ${user?.email ?? ''}`, true, null, 401)
      }
    }
    else {
      JsonResponse(res, responseMessage, success, null, 401)
    }
  } catch(error) {
    let message = 'Something Went Wrong'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, false, null, 403)
  }
})

// Verify Token with JWT and update Password
adminRouter.get('/admin/password/request-password/jwt_token/verify', async (req, res) => {
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

// Change Password When via password reset token
adminRouter.put(`/admin/password/change_password`, async (req, res) => {
  const { authorization } = req.headers, {old_password, new_password} = req.body
  let message = 'Error Updating Password';

  try {
    console.log("ONE")
    const verifyToken = <JWTDataProps><unknown>verifyJSONToken(authorization as string)

    if (verifyToken) {
      const admin = await getAdminBaseDataAndProfileDataByAdminId(verifyToken?.id ?? '')

      if(validatePassword(old_password, admin?.password ?? '')) {
        const password = generatePasswordHash(new_password)

        if (await updateAdminPasswordByAdminId(verifyToken?.id ?? '', password))
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

export default adminRouter