import express = require('express');
// @ts-ignore
import hospitalGetRequest from '@routes/hospital/hospitalGetRequestHandler';
// @ts-ignore
import hospitalPostRequest from '@routes/hospital/hospitalPostRequestHandler';

const hospitalRouter = express.Router();

hospitalRouter.use('/', hospitalGetRequest);
hospitalRouter.use('/', hospitalPostRequest);

export default hospitalRouter;
