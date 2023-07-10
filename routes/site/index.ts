import express = require('express');
import sitePostRequest from './sitePostRequestHandler';
import siteGetRequest from './siteGetRequestHandler';

const siteRouter = express.Router();

siteRouter.use('/', sitePostRequest);
siteRouter.use('/', siteGetRequest);

export default siteRouter;
