import express = require('express');
import { JsonResponse } from '../../util/responses';
import {
  getDistinctOrganizationSiteCountriesAndStates,
  siteTableDatastore,
} from '../../datastore/siteStore';
import { verifyUserPermission } from '../../lib/auth';
import sitePostRequest from './sitePostRequestHandler';
import siteGetRequest from './siteGetRequestHandler';

const siteRouter = express.Router();

siteRouter.use('/', sitePostRequest);
siteRouter.use('/', siteGetRequest);

export default siteRouter;
