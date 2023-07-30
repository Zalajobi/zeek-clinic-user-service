import express = require('express');
import departmentPostRequest from './departmentPostRequestHandler';
import departmentGetRequest from './departmentGetRequestHandler';

const departmentRouter = express.Router();

departmentRouter.use('/', departmentPostRequest);
departmentRouter.use('/', departmentGetRequest);

export default departmentRouter;
