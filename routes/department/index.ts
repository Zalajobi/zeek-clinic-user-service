import express = require('express');
// @ts-ignore
import departmentPostRequest from '@routes/department/departmentPostRequestHandler';
// @ts-ignore
import departmentGetRequest from '@routes/department/departmentGetRequestHandler';
// @ts-ignore
import departmentPutRequest from '@routes/department/departmentPutRequestHandler';

const departmentRouter = express.Router();

departmentRouter.use('/', departmentPostRequest);
departmentRouter.use('/', departmentGetRequest);
departmentRouter.use('/', departmentPutRequest);

export default departmentRouter;
