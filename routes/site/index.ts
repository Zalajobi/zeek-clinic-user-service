import express = require('express');
import sitePostRequest from '@routes/site/sitePostRequestHandler';
import siteGetRequest from '@routes/site/siteGetRequestHandler';
import siteDeleteRequest from '@routes/site/siteDeleteRequestHandler';

const siteRouter = express.Router();

siteRouter.use('/', sitePostRequest);
siteRouter.use('/', siteGetRequest);
siteRouter.use('/', siteDeleteRequest);

export default siteRouter;
