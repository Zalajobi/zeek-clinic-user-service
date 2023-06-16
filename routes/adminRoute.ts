import express = require("express");
import {JsonResponse} from "../util/responses";
import {adminModelProps, departmentModelProps, roleModelProps} from "../types";
import {verifyUserPermission} from "../lib/auth";
import {createNewDepartment} from "../datastore/departmentStore";
import {generatePasswordHash} from "../helpers/utils";
import {createNewAdmin} from "../datastore/adminStore";

const adminRouter = express.Router();

adminRouter.post('/admin/create', async (req, res) => {
  let message = 'Not Authorised', success = false

  try {
    const data = req.body as departmentModelProps

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


export default adminRouter