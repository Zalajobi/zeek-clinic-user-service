import { Router } from 'express';
import rolePostRequest from '@routes/role/rolePostRequestHandler';
import roleGetRequest from '@routes/role/roleGetRequestHandler';

const roleRouter = Router();
roleRouter.use('/', rolePostRequest);
roleRouter.use('/', roleGetRequest);

export default roleRouter;
