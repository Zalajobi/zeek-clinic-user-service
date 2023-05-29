import express = require("express");
import cors = require('cors')

import loginRouter from "./routes/loginRoute";
import signupRouter from "./routes/signnupRoute";
import passwordRouter from "./routes/passwordRoute";
import superadminRouter from "./routes/superadminRoute";
import hospitalRouter from "./routes/hospitalRoute";
import siteRouter from "./routes/siteRoute";
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

app.listen(process.env.DEV_PORT, () => {
  console.log(`Example app listening on port ${process.env.DEV_PORT}`)
})