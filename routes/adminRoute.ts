import express = require("express");
import {JsonResponse} from "../util/responses";
import {adminModelProps} from "../types";
import {verifyUserPermission} from "../lib/auth";
import {generateJSONTokenCredentials, generatePasswordHash, validatePassword} from "../helpers/utils";
import {createNewAdmin, verifyAdminLoginCredentials} from "../datastore/adminStore";
import {getAdminBaseData} from "../datastore/userStore";

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

    const admin = await verifyAdminLoginCredentials(email as string)

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

export default adminRouter