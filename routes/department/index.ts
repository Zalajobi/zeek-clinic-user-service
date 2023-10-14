import express = require('express');
// @ts-ignore
import departmentPostRequest from '@routes/department/departmentPostRequestHandler';
// @ts-ignore
import departmentGetRequest from '@routes/department/departmentGetRequestHandler';

const departmentRouter = express.Router();

departmentRouter.use('/', departmentPostRequest);
departmentRouter.use('/', departmentGetRequest);

export default departmentRouter;
