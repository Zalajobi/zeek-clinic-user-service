import express = require("express");
import cors = require('cors')
import "reflect-metadata"
import signupRouter from "./routes/signnupRoute";
import passwordRouter from "./routes/passwordRoute";
import superadminRouter from "./routes/superadminRoute";
import hospitalRouter from "./routes/hospitalRoute";
import siteRouter from "./routes/siteRoute";
import {AppDataSource} from "./data-source";
import {SuperAdmin} from "./typeorm/entity/superAdmin";
import {generatePasswordHash} from "./helpers/utils";
import {superAdminRepo} from "./typeorm/repositories/superAdminRepository";
import roleRouter from "./routes/roleRouter";
import departmentRouter from "./routes/departmentRoute";
import adminRouter from "./routes/adminRoute";
require('dotenv').config()

const app = express();

app.use(express.json());
app.use(cors())
app.use(`${process.env.ACCOUNT_BASE_URL}`, signupRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, passwordRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, superadminRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, hospitalRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, siteRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, roleRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, departmentRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, adminRouter)

AppDataSource.initialize().then(async () => {
  console.log("Initialising TypeORM...")
  const superAdminRepository = superAdminRepo()

  console.log("Generating Superadmin...")
  const superAdmin1 = new SuperAdmin();
  superAdmin1.email = 'cduckett83@theglobeandmail.com';
  superAdmin1.username = 'gschaumaker2l';
  superAdmin1.first_name = 'Mathian';
  superAdmin1.last_name = 'Schaumaker'
  superAdmin1.phone_number = '+62-829-604-5743'
  superAdmin1.password = generatePasswordHash('password123')

  const superAdmin2 = new SuperAdmin();
  superAdmin2.email = 'zalajobi@gmail.com';
  superAdmin2.username = 'zalajobi';
  superAdmin2.first_name = 'Zhikrullah';
  superAdmin2.last_name = 'IGBALAJOBI'
  superAdmin2.phone_number = '+352-346-220-5311'
  superAdmin2.password = generatePasswordHash('password123')

  // await superAdminRepository.save(superAdmin1)
  // await superAdminRepository.save(superAdmin2)

  console.log('Superadmin users Generated Successfully')

}).catch(error => console.log(error))

app.listen(process.env.DEV_PORT, () => {
  console.log(`Example app listening on port ${process.env.DEV_PORT}`)
})