import express = require("express");
import {generateJSONTokenCredentials, generatePasswordHash, validatePassword, verifyJSONToken} from "../helpers/utils";
import {createSuperAdmin, getSuperadminBaseData, verifySuperadminUser} from "../datastore/superadminStore";
import {sendSignupCompleteProfileEmail} from "../messaging/email";
import { admin_role, department } from '@prisma/client'

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

superadminRouter.post('/super-admin/auth/login', async (req, res) => {
  let responseMessage = 'Incorrect Credentials', jwtSignData = null, success = false

  // console.log(req.headers.token)
  try {
    const admin = await getSuperadminBaseData(req.body.email)

    console.log(admin)

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

export default superadminRouter