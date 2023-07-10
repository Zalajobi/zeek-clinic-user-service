import { Router } from 'express';
import superadminRouter from './superadmin';
import hospitalRouter from './hospital';
import siteRouter from './site';
import roleRouter from './role';
import departmentRouter from './department';
import adminRouter from './admin';
import { BASE_URL } from '../util/constants';

let rootRouter = Router();

rootRouter.use(`${BASE_URL}/super-admin`, superadminRouter);
rootRouter.use(`${BASE_URL}/hospital`, hospitalRouter);
rootRouter.use(`${BASE_URL}/site`, siteRouter);
rootRouter.use(`${BASE_URL}/role`, roleRouter);
rootRouter.use(`${BASE_URL}/department`, departmentRouter);
rootRouter.use(`${BASE_URL}/admin`, adminRouter);

export default rootRouter;
