import { Router } from 'express';
import rolePostRequest from '@routes/role/rolePostRequestHandler';
import roleGetRequest from '@routes/role/roleGetRequestHandler';
import rolePutRequest from '@routes/role/rolePutRequestHandler';

const roleRouter = Router();
roleRouter.use('/', rolePostRequest);
roleRouter.use('/', roleGetRequest);
roleRouter.use('/', rolePutRequest);

export default roleRouter;
