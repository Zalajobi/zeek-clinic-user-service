import { Router } from 'express';
import providersPostRequestHandler from './providersPostRequestHandler';

const providersRouter = Router();

providersRouter.use('/', providersPostRequestHandler);

export default providersRouter;
