import express = require('express');
// @ts-ignore
import roleGetRequest from '@routes/role/roleGetRequestHandler';

const roleRouter = express.Router();
roleRouter.use('/', roleGetRequest);

export default roleRouter;
