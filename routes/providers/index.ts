import { Router } from 'express';
import providersPostRequestHandler from './providersPostRequestHandler';
import providersGetRequestHandler from './providersGetRequestHandler';

const providersRouter = Router();

providersRouter.use('/', providersPostRequestHandler);
providersRouter.use('/', providersGetRequestHandler);

export default providersRouter;
