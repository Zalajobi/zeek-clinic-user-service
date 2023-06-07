import express = require("express");
import {JsonResponse} from "../util/responses";
import {verifySuperadminUser} from "../datastore/superadminStore";
import {verifyAdmin} from "../datastore/adminStore";
import {adminCreateSite, getSiteInformation} from "../datastore/siteStore";
import {createSiteProps} from "../types/siteAndHospitalTypes";


const siteRouter = express.Router();

siteRouter.post('/site/create', async (req, res) => {
  let message = 'Not Authorised', success = false

  try {
    const response = await Promise.all([
      verifyAdmin(req?.headers?.token as string),
      verifySuperadminUser(req?.headers?.token as string)
    ])

    if (!response)
      return JsonResponse(res, message, success, null, 401)


    if (response[0]?.role === 'HOSPITAL_ADMIN' || response[0]?.role === 'SUPER_ADMIN' || response[1]) {
      const site = await adminCreateSite(req.body as createSiteProps)
      if (site)
        return JsonResponse(res, 'New Organization Added', true, null, 200)
    }

    return JsonResponse(res, 'Something went wrong', false, null, 400)
  } catch(error) {
    let message = 'Not Authorized'
    if (error instanceof Error)
      message = error.message

    return JsonResponse(res, message, success, null, 403)
  }
})

siteRouter.get('/site/get-information', async  (req, res) => {
  let message = 'Not Authorised', success = false

  try {
    // const siteData = await getSiteInformation(req.params.hospitalId as string)
  } catch(error) {
    let message = 'Not Authorized'
    if (error instanceof Error)
      message = error.message

    return JsonResponse(res, message, success, null, 403)
  }
})


export default siteRouter