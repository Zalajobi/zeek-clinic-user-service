import { Router } from 'express';
import providersPostRequestHandler from '@routes/providers/providersPostRequestHandler';
import providersGetRequestHandler from '@routes/providers/providersGetRequestHandler';
import providersPutRequestHandler from '@routes/providers/providersPutRequestHandler';

const providersRouter = Router();

providersRouter.use('/', providersPostRequestHandler);
providersRouter.use('/', providersGetRequestHandler);
providersRouter.use('/', providersPutRequestHandler);

export default providersRouter;
