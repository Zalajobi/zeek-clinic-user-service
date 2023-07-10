import { Router } from 'express';
import adminPostRequestHandler from './postRequestHandler';
import adminPutRequestHandler from './putRequestHandler';
import adminGetRequestHandler from './getRequestHandler';

const adminRouter = Router();

adminRouter.use('/', adminGetRequestHandler);
adminRouter.use('/', adminPostRequestHandler);
adminRouter.use('/', adminPutRequestHandler);

// Get Admin Base Data for Dashboard header

export default adminRouter;
