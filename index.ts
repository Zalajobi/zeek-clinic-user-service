import express = require("express");
import cors = require('cors')
import "reflect-metadata"
import loginRouter from "./routes/loginRoute";
import signupRouter from "./routes/signnupRoute";
import passwordRouter from "./routes/passwordRoute";
import superadminRouter from "./routes/superadminRoute";
import hospitalRouter from "./routes/hospitalRoute";
import siteRouter from "./routes/siteRoute";
import {AppDataSource} from "./data-source";
require('dotenv').config()

const app = express();

app.use(express.json());
app.use(cors())
app.use(`${process.env.ACCOUNT_BASE_URL}`, loginRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, signupRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, passwordRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, superadminRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, hospitalRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, siteRouter)

AppDataSource.initialize().then(async () => {
  console.log("Initialising TypeORM...")

  console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))

app.listen(process.env.DEV_PORT, () => {
  console.log(`Example app listening on port ${process.env.DEV_PORT}`)
})