import express = require("express");
import {generatePasswordHash} from "../helpers/utils";
import {createSuperAdmin} from "../datastore/superadminStore";
import {sendSignupCompleteProfileEmail} from "../messaging/email";

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

export default superadminRouter