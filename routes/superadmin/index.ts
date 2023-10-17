import express = require('express');

import superadminGetRouter from '@routes/superadmin/superadminGetRequestHandler';

import superadminPostRequest from '@routes/superadmin/superadminPostRequestHandler';

const superadminRouter = express.Router();

superadminRouter.use('/', superadminGetRouter);
superadminRouter.use('/', superadminPostRequest);

export default superadminRouter;
