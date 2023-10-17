import express = require('express');
import sitePostRequest from '@routes/site/sitePostRequestHandler';
import siteGetRequest from '@routes/site/siteGetRequestHandler';

const siteRouter = express.Router();

siteRouter.use('/', sitePostRequest);
siteRouter.use('/', siteGetRequest);

export default siteRouter;
