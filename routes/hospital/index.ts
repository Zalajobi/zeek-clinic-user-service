import express = require('express');

import hospitalGetRequest from '@routes/hospital/hospitalGetRequestHandler';

import hospitalPostRequest from '@routes/hospital/hospitalPostRequestHandler';

const hospitalRouter = express.Router();

hospitalRouter.use('/', hospitalGetRequest);
hospitalRouter.use('/', hospitalPostRequest);

export default hospitalRouter;
