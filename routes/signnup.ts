import express = require("express");
import {createAdmin} from "../datastore/user";
import {generatePasswordHash} from "../helpers/utils";
import {sendSignupCompleteProfileEmail} from "../messaging/email";


const signupRouter = express.Router();

signupRouter.post(`/admin/signup`, async (req, res) => {
  let responseMessage = 'User With Email, Username or Phone Number Already Exist...'
  const data = req.body
  data.password = generatePasswordHash(req.body.password)
  const adminUser = await createAdmin(data)
  if (adminUser && typeof adminUser !== 'string') {
    sendSignupCompleteProfileEmail(data?.email, adminUser.id, data.first_name)
    responseMessage = 'Admin Created'
  } else {
    responseMessage = 'Error Creating Admin'
  }

  res.send(responseMessage)
})

export default signupRouter;