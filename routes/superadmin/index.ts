import express = require('express');
// @ts-ignore
import superadminGetRouter from '@routes/superadmin/superadminGetRequestHandler';
// @ts-ignore
import superadminPostRequest from '@routes/superadmin/superadminPostRequestHandler';

const superadminRouter = express.Router();

superadminRouter.use('/', superadminGetRouter);
superadminRouter.use('/', superadminPostRequest);

export default superadminRouter;
