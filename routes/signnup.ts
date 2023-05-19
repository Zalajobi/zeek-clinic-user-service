import express = require("express");
import {createAdmin} from "../datastore/user";
import {generatePasswordHash} from "../helpers/utils";
import {sendSignupCompleteProfileEmail} from "../messaging/email";
import {createProvider} from "../datastore/provider";
import {JsonResponse} from "../util/responses";


const signupRouter = express.Router();

signupRouter.post(`/admin/signup`, async (req, res) => {
  let responseMessage = 'User With Email, Username or Phone Number Already Exist...', success = false

  try {
    const data = req.body
    data.password = generatePasswordHash(req.body.password)
    const adminUser = await createAdmin(data)
    if (adminUser && typeof adminUser !== 'string') {
      sendSignupCompleteProfileEmail(data?.email, adminUser.id, data.first_name)
      responseMessage = 'Admin Created'
      success = true
    } else {
      responseMessage = 'Error Creating Admin'
    }

    JsonResponse(res, responseMessage, success, null, 200)
  } catch(error) {
    let message = 'Not Authorized'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, success, null, 403)
  }
})

signupRouter.post(`/admin/provider/create`, async (req, res) => {
  let responseMessage = 'User With Email, Username or Phone Number Already Exist...'

  try {
    const {department, provider_role, ...data} = req.body
    data.password = generatePasswordHash(req.body.password)
    const newProvider = await createProvider(data, req?.body?.department, req?.body?.provider_role)

    if (newProvider && typeof newProvider !== 'string') {
      sendSignupCompleteProfileEmail(data?.email, newProvider.id, data.first_name)
      responseMessage = 'New Provider Created'
    } else {
      responseMessage = 'Error Creating Provider'
    }

    res.json(
      {
        message: responseMessage
      }
    )
  } catch(error) {
    let message = 'Not Authorized'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, false, null, 403)
  }
})

export default signupRouter;