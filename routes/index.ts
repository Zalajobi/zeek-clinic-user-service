import { Router } from 'express';
// @ts-ignore
import superadminRouter from '@routes/superadmin';
// @ts-ignore
import { BASE_URL } from '@util/constants';
// @ts-ignore
import siteRouter from '@routes/site';
// @ts-ignore
import hospitalRouter from '@routes/hospital';
// @ts-ignore
import roleRouter from '@routes/role';
// @ts-ignore
import departmentRouter from '@routes/department';
// @ts-ignore
import adminRouter from '@routes/admin';
// @ts-ignore
import providersRouter from '@routes/providers';

let rootRouter = Router();

rootRouter.use(`${BASE_URL}/super-admin`, superadminRouter);
rootRouter.use(`${BASE_URL}/hospital`, hospitalRouter);
rootRouter.use(`${BASE_URL}/site`, siteRouter);
rootRouter.use(`${BASE_URL}/role`, roleRouter);
rootRouter.use(`${BASE_URL}/department`, departmentRouter);
rootRouter.use(`${BASE_URL}/admin`, adminRouter);
rootRouter.use(`${BASE_URL}/providers`, providersRouter);

export default rootRouter;
