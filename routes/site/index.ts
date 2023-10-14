import express = require('express');
// @ts-ignore
import sitePostRequest from '@routes/site/sitePostRequestHandler';
// @ts-ignore
import siteGetRequest from '@routes/site/siteGetRequestHandler';

const siteRouter = express.Router();

siteRouter.use('/', sitePostRequest);
siteRouter.use('/', siteGetRequest);

export default siteRouter;
