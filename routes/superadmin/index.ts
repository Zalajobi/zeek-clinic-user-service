import express = require('express');
import superadminGetRouter from './superadminGetRequestHandler';
import superadminPostRequest from './superadminPostRequestHandler';

const superadminRouter = express.Router();

superadminRouter.use('/', superadminGetRouter);
superadminRouter.use('/', superadminPostRequest);

export default superadminRouter;
