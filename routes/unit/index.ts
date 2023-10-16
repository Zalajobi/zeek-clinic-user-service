import express = require('express');
// @ts-ignore
import unitGetRequest from '@routes/unit/unitGetRequestHandler';
// @ts-ignore
import unitPutRequest from '@routes/unit/unitPutRequestHandler';
// @ts-ignore
import unitPostRequest from '@routes/unit/unitPostRequestHandler';

const unitRouter = express.Router();

unitRouter.use('/', unitGetRequest);
unitRouter.use('/', unitPutRequest);
unitRouter.use('/', unitPostRequest);

export default unitRouter;
