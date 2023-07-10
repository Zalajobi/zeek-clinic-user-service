import express = require('express');
import departmentPostRequest from './departmentPostRequestHandler';

const departmentRouter = express.Router();

departmentRouter.use('/', departmentPostRequest);

export default departmentRouter;
