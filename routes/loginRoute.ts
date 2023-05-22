import express = require("express");
import {getAdminBaseData} from "../datastore/userStore";
import {generateJSONTokenCredentials, validatePassword} from "../helpers/utils";
import {JsonResponse} from "../util/responses";

require('dotenv').config()
const loginRouter = express.Router();

loginRouter.post(`/admin/login`, async (req, res) => {
  let responseMessage = 'Incorrect Credentials', jwtSignData = null, success = false
  try {
    {
      const admin = await getAdminBaseData(req.body.email)

      if (validatePassword(req.body.password, admin?.password ?? '')) {
        const jwtData = {
          id: admin?.id ?? '',
          email: admin?.email ?? '',
          role: admin?.role ?? ''
        }

        jwtSignData = generateJSONTokenCredentials(jwtData)
        responseMessage= 'Login Successful'
        success = true
      }

      JsonResponse(res, responseMessage, success, {
        token: jwtSignData
      }, 403)
    }
  } catch(error) {
    let message = 'Not Authorized'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, success, null, 403)
  }
})

export default loginRouter;