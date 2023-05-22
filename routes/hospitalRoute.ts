import express = require("express");
import signupRouter from "./signnupRoute";


const hospitalRouter = express.Router();

signupRouter.post('/hospital/create', async (req, res) => {
  let message = 'Not Authorised', success = false

  res

})


export default hospitalRouter