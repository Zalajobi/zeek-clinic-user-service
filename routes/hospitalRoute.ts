import express = require("express");
import signupRouter from "./signnupRoute";
import {JsonResponse} from "../util/responses";
import {verifySuperadminUser} from "../datastore/superadminStore";
import {CreateHospitalProps} from "../types/hospitalTypes";
import {createNewHospital} from "../datastore/hospitalStore";
import {excludeKeys} from "../util";


const hospitalRouter = express.Router();

signupRouter.post('/hospital/create', async (req, res) => {
  let message = 'Not Authorised', success = false

  try {
    const user = await verifySuperadminUser(req?.headers?.token as string)

    if (!user)
      JsonResponse(res, message, false, null, 401)

    const hospital = await createNewHospital(req.body as CreateHospitalProps)
    if (!hospital)
      JsonResponse(res, 'Something went wrong', false, null, 400)

    JsonResponse(res, 'New Organization Added', true, null, 200)
  } catch(error) {
    let message = 'Not Authorized'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, false, null, 403)
  }
})


export default hospitalRouter