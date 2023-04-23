import express = require("express");
import {getAdminBaseData} from "../datastore/user";
import {generateJSONTokenCredentials, validatePassword, verifyJSONToken} from "../helpers/utils";
import {callNumber, sendSMSMessage} from "../messaging/twilio";

require('dotenv').config()
const loginRouter = express.Router();
// 2349048258830
// 2347053980998

loginRouter.get(`/admin/login`, async (req, res) => {
  await sendSMSMessage('+2347053980998', "Welcome to Zeek Clinic - Password Reset SMS Testing - Twilio")
  await callNumber('+2347053980998', "Welcome to Zeek Clinic - Password Reset SMS Testing - Twilio")
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