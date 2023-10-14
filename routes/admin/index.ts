import { Router } from 'express';
// @ts-ignore
import adminPostRequestHandler from '@routes/admin/adminPostRequestHandler';
// @ts-ignore
import adminPutRequestHandler from '@routes/admin/adminPutRequestHandler';
// @ts-ignore
import adminGetRequestHandler from '@routes/admin/adminGetRequestHandler';

const adminRouter = Router();

adminRouter.use('/', adminGetRequestHandler);
adminRouter.use('/', adminPostRequestHandler);
adminRouter.use('/', adminPutRequestHandler);

export default adminRouter;
