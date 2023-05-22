import express = require("express");
import {JsonResponse} from "../util/responses";
import {verifySuperadminUser} from "../datastore/superadminStore";
import {verifyAdmin} from "../datastore/adminStore";


const siteRouter = express.Router();

siteRouter.post('/site/create', async (req, res) => {
  let message = 'Not Authorised', success = false

  try {
    const user = await verifyAdmin(req?.headers?.token as string)

    console.log(user)

    // if (user?.role !== 'HOSPITAL_ADMIN' || !user)
    //   JsonResponse(res, message, success, null, 401)

    // const hospital = await createNewHospital(req.body as CreateHospitalProps)
    // if (!hospital)
    //   JsonResponse(res, 'Something went wrong', success, null, 400)

    JsonResponse(res, 'New Organization Added', true, null, 200)
  } catch(error) {
    let message = 'Not Authorized'
    if (error instanceof Error)
      message = error.message

    JsonResponse(res, message, success, null, 403)
  }
})


export default siteRouter