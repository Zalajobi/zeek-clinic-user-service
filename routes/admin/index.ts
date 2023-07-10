import { Router } from 'express';
import adminPostRequestHandler from './adminPostRequestHandler';
import adminPutRequestHandler from './adminPutRequestHandler';
import adminGetRequestHandler from './adminGetRequestHandler';

const adminRouter = Router();

adminRouter.use('/', adminGetRequestHandler);
adminRouter.use('/', adminPostRequestHandler);
adminRouter.use('/', adminPutRequestHandler);

export default adminRouter;
