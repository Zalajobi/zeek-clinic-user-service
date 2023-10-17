import { Router } from 'express';
import adminPostRequestHandler from '@routes/admin/adminPostRequestHandler';
import adminPutRequestHandler from '@routes/admin/adminPutRequestHandler';
import adminGetRequestHandler from '@routes/admin/adminGetRequestHandler';

const adminRouter = Router();

adminRouter.use('/', adminGetRequestHandler);
adminRouter.use('/', adminPostRequestHandler);
adminRouter.use('/', adminPutRequestHandler);

export default adminRouter;
