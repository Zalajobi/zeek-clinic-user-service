import express = require('express');
// @ts-ignore
import unitGetRequest from '@routes/unit/unitGetRequestHandler';

const unitRouter = express.Router();

unitRouter.use('/', unitGetRequest);

export default unitRouter;
