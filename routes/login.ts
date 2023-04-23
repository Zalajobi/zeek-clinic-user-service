import express = require("express");
import {getAdminBaseData} from "../datastore/user";
import {generateJSONTokenCredentials, validatePassword, verifyJSONToken} from "../helpers/utils";

require('dotenv').config()
const loginRouter = express.Router();

loginRouter.get(`/admin/login`, async (req, res) => {
  let responseMessage = 'Incorrect Credentials', jwtSignData = null
  const admin = await getAdminBaseData(req.body.email)

  if (validatePassword(req.body.password, admin?.password ?? '')) {
    const jwtData = {
      id: admin?.id ?? '',
      email: admin?.email ?? '',
      role: admin?.role ?? ''
    }

    jwtSignData = generateJSONTokenCredentials(jwtData)
    responseMessage= 'Login Successful'
  }

  res.status(200).json({
    "message": responseMessage,
    token: jwtSignData
  })
})

export default loginRouter;