import { Router } from 'express';
// @ts-ignore
import roleGetRequest from '@routes/role/roleGetRequestHandler';

const roleRouter = Router();
roleRouter.use('/', roleGetRequest);

export default roleRouter;
