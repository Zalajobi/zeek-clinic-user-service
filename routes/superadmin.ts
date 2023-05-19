import express = require("express");
import {
  generateJSONTokenCredentials,
  generatePasswordHash,
  generateTemporaryPassword,
  validatePassword
} from "../helpers/utils";
import {
  adminCreateNewUser,
  createSuperAdmin, getSuperadminBaseData,
  getSuperadminLoginData,
  verifySuperadminUser
} from "../datastore/superadminStore";
import {sendSignupCompleteProfileEmail} from "../messaging/email";
import {admin, admin_role, department} from '@prisma/client'
import {SuperadminCreateAdmin} from "../types/superadminTypes";
import {JsonResponse} from "../util/responses";

const superadminRouter = express.Router();

superadminRouter.post('/super-admin/create/new_user', async (req, res) => {
  let responseMessage = 'User With Email, Username or Phone Number Already Exist...', success = false
  try {
    const data = req.body
    data.password = generatePasswordHash(req.body.password)

    const adminUser = await createSuperAdmin(data)

    if (adminUser && typeof adminUser !== 'string') {
      sendSignupCompleteProfileEmail(data?.email, adminUser.id, data.first_name)
      responseMessage = 'Admin Created'
      success = true
    } else {
      responseMessage = 'Error Creating Admin'
    }

    res.json({
      message: responseMessage,
      success,
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
})

superadminRouter.get('/super-admin/create/roles_and_departments', async(req, res) => {
  let success = false;
  try {
    const adminData = await verifySuperadminUser(req?.headers?.token as string)

    if (adminData) {
      res.json({
        message: 'Roles and departments data fetch successful',
        success: true,
        data: {
          role: admin_role,
          department,
        }
      })
    }
    else {
      res.json({
        message: 'Unauthorised request',
        success,
        data: null
      })
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
})

superadminRouter.post('/super-admin/create/admin', async (req, res) => {
  let message = 'Unauthorized Request';

  try {
    const adminUser = await verifySuperadminUser(req?.headers?.token as string)
    if (!adminUser)
      res.json({
        message,
        data: null,
        success: false
      })

    const tempPassword = generateTemporaryPassword()
    const password = generatePasswordHash(tempPassword);

    const newAdminData = {
      ...req.body,
      password
    }

    const newUserStatus = await adminCreateNewUser(newAdminData as SuperadminCreateAdmin)

    res.json({
      message: newUserStatus ? 'Admin user created successfully' : 'Admin with email/username/phone number already exists',
      data: null,
      success: newUserStatus ? true : false
    })

  } catch (e) {
    res.json({
      message: 'Error Creating Admin',
      data: null,
      success: false
    })
  }
})

superadminRouter.post('/super-admin/auth/login', async (req, res) => {
  let responseMessage = 'Incorrect Credentials', jwtSignData = null, success = false

  try {
    const admin = await getSuperadminLoginData(req.body.email)

    if (validatePassword(req.body.password, admin?.password ?? '')) {
      const jwtData = {
        id: admin?.id ?? '',
        email: admin?.email ?? '',
      }

      jwtSignData = generateJSONTokenCredentials(jwtData)
      responseMessage= 'Login Successful'
      success = true
    }

    res.json({
      message: responseMessage,
      data: {
        token: jwtSignData
      },
      success
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
})

superadminRouter.get('/super-admin/profile/get-data', async(req, res) => {
  let success = false;
  try {
    const adminData = await verifySuperadminUser(req?.headers?.token as string)

    if (!adminData)
      JsonResponse(res, 'Not Authorized', false, null, 403)

    const data = await getSuperadminBaseData(adminData?.id as string)
    JsonResponse(res, 'Authorized', true, data, 200)

  } catch(e) {
    if (typeof e === "string") {
      JsonResponse(res, e.toUpperCase() as string, success, null, 404)
    } else if (e instanceof Error) {
      JsonResponse(res, e.message  as string, success, null, 404)
    }
  }
})

export default superadminRouter