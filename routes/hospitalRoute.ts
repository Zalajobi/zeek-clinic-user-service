import express = require("express");
import {JsonResponse} from "../util/responses";
import {verifySuperadminUser} from "../datastore/superadminStore";
import {CreateHospitalProps} from "../types/siteAndHospitalTypes";
import {createNewHospital, selectAllAvailableCountries, superAdminGetHospitals} from "../datastore/hospitalStore";


const hospitalRouter = express.Router();

hospitalRouter.post('/hospital/create', async (req, res) => {
  let message = 'Not Authorised'

  try {
    const user = await verifySuperadminUser(req?.headers?.token as string)

    if (!user)
      return JsonResponse(res, message, false, null, 401)

    const hospital = await createNewHospital(req.body as CreateHospitalProps)

    if (!hospital) {
      return JsonResponse(res, 'Email Or Phone Number Already Exists', false, null, 200)
    }

    return JsonResponse(res, 'New Organization Added', true, null, 200)
  } catch(error) {
    if (error instanceof Error)
      message = error.message

    return JsonResponse(res, message, false, null, 403)
  }
})

hospitalRouter.get('/super-admin/hospitals', async (req, res) => {
  let message = 'Not Authorised', success = false
  const { page, per_page, from_date, to_date, search, country, status} = req.query

  try {
    const user = await verifySuperadminUser(req?.headers?.token as string)

    if (!user)
      return JsonResponse(res, message, success, null, 401)

    const data = await superAdminGetHospitals(
      page as unknown as number,
      per_page as unknown as number,
      search as unknown as string,
      from_date as unknown as string,
      to_date as unknown as string,
      country as unknown as string,
      status as unknown as string,
    )

    return JsonResponse(res, 'Success', true, data, 200)
  } catch(error) {
    if (error instanceof Error)
      message = error.message

    return JsonResponse(res, message, false, null, 401)
  }
})

hospitalRouter.get('/super-admin/hospitals/countries/distinct', async (req, res) => {
  let message = 'Not Authorised', success = false

  try {
    const user = await verifySuperadminUser(req?.headers?.token as string)

    if (!user)
      return JsonResponse(res, message, success, null, 401)

    const distinctHospitals = await selectAllAvailableCountries()

    if (!distinctHospitals)
      return JsonResponse(res, 'Something went wrong', success, null, 410)
    else
      return JsonResponse(res, 'Get Distinct Success', true, distinctHospitals, 200)

  } catch(error) {
    if (error instanceof Error)
      message = error.message

    return JsonResponse(res, message, success, null, 401)
  }
})


export default hospitalRouter