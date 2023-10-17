import express = require('express');

import unitGetRequest from '@routes/unit/unitGetRequestHandler';

import unitPutRequest from '@routes/unit/unitPutRequestHandler';

import unitPostRequest from '@routes/unit/unitPostRequestHandler';

const unitRouter = express.Router();

unitRouter.use('/', unitGetRequest);
unitRouter.use('/', unitPutRequest);
unitRouter.use('/', unitPostRequest);

export default unitRouter;
