import express = require('express');
import departmentPostRequest from '@routes/department/departmentPostRequestHandler';
import departmentGetRequest from '@routes/department/departmentGetRequestHandler';
import departmentPutRequest from '@routes/department/departmentPutRequestHandler';

const departmentRouter = express.Router();

departmentRouter.use('/', departmentPostRequest);
departmentRouter.use('/', departmentGetRequest);
departmentRouter.use('/', departmentPutRequest);

export default departmentRouter;
