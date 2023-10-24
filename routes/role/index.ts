import { Router } from 'express';
import roleGetRequest from '@routes/role/roleGetRequestHandler';

const roleRouter = Router();
roleRouter.use('/', roleGetRequest);

export default roleRouter;
