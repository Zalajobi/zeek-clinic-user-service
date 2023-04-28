import express = require("express");
import cors = require('cors')

import loginRouter from "./routes/login";
import signupRouter from "./routes/signnup";
import passwordRouter from "./routes/password";
require('dotenv').config()

const app = express();

app.use(express.json());
app.use(cors())
app.use(`${process.env.ACCOUNT_BASE_URL}`, loginRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, signupRouter)
app.use(`${process.env.ACCOUNT_BASE_URL}`, passwordRouter)

app.listen(process.env.DEV_PORT, () => {
  console.log(`Example app listening on port ${process.env.DEV_PORT}`)
})