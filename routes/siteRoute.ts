import express = require("express");
import {JsonResponse} from "../util/responses";
import {verifySuperadminUser} from "../datastore/superadminStore";
import {verifyAdmin} from "../datastore/adminStore";
import {
  adminCreateSite,
  getDistinctOrganizationSiteCountriesAndStates,
  siteTableDatastore
} from "../datastore/siteStore";
import {createSiteProps} from "../types/siteAndHospitalTypes";
import {verifyUserPermission} from "../lib/auth";


const siteRouter = express.Router();

siteRouter.post('/site/create', async (req, res) => {
  let message = 'Not Authorised', success = false

  try {
    const verifiedUser = await verifyUserPermission(req?.headers?.token as string, ['SUPER_ADMIN', 'HOSPITAL_ADMIN'])

    if (!verifiedUser)
      return JsonResponse(res, message, success, null, 401)

    const site = await adminCreateSite(req.body as createSiteProps)

    return JsonResponse(res, site?.message as string, site?.success as boolean, null, site?.success ? 200 : 400)

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


// Get All countries and States where an organization has a site. These countries and states are distinct
siteRouter.get('/site/get-distinct/country-and-state/organization', async (req, res) => {
  let message = 'Not Authorised', success = false
  try {
    const verifiedUser = await verifyUserPermission(req?.headers?.token as string, ['SUPER_ADMIN', 'HOSPITAL_ADMIN'])

    if (!verifiedUser)
      return JsonResponse(res, message, success, null, 401)

    const data = await getDistinctOrganizationSiteCountriesAndStates(req.query.hospital_id as string)
    return JsonResponse(res, 'Success', true, data, 200)
  } catch(error) {
    if (error instanceof Error)
      message = error.message

    return JsonResponse(res, message, false, null, 401)
  }
})

siteRouter.get('/site/organization/table-filter', async (req, res) => {
  let message = 'Not Authorised', success = false
  const { page, per_page, from_date, to_date, search, country, status, state, hospital_id } = req.query

  try {
    const verifiedUser = await verifyUserPermission(req?.headers?.token as string, ['SUPER_ADMIN', 'HOSPITAL_ADMIN'])

    if (!verifiedUser)
      return JsonResponse(res, message, success, null, 401)

    const data = await siteTableDatastore(
      page as unknown as number,
      per_page as unknown as number,
      search as unknown as string,
      from_date as unknown as string,
      to_date as unknown as string,
      country as unknown as string,
      status as unknown as string,
      state as unknown as string,
      hospital_id as unknown as string,
    )

    // console.log(data)

    return JsonResponse(res, 'Success', true, data, 200)
  } catch(error) {
    if (error instanceof Error)
      message = error.message

    return JsonResponse(res, message, false, null, 401)
  }
})


export default siteRouter