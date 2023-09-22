import { Router } from 'express';
// @ts-ignore
import providersPostRequestHandler from '@routes/providers/providersPostRequestHandler';
// @ts-ignore
import providersGetRequestHandler from '@routes/providers/providersGetRequestHandler';
// @ts-ignore
import providersPutRequestHandler from '@routes/providers/providersPutRequestHandler';

const providersRouter = Router();

providersRouter.use('/', providersPostRequestHandler);
providersRouter.use('/', providersGetRequestHandler);
providersRouter.use('/', providersPutRequestHandler);

export default providersRouter;
