import express = require('express');
import hospitalGetRequest from './hospitalGetRequestHandler';
import hospitalPostRequest from './hospitalPostRequestHandler';

const hospitalRouter = express.Router();

hospitalRouter.use('/', hospitalGetRequest);
hospitalRouter.use('/', hospitalPostRequest);

export default hospitalRouter;
