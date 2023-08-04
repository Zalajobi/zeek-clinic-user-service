import express = require('express');
import roleGetRequest from './roleGetRequestHandler';

const roleRouter = express.Router();
roleRouter.use('/', roleGetRequest);

export default roleRouter;
