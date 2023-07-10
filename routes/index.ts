import { Router } from 'express';
import superadminRouter from './superadmin';
import hospitalRouter from './hospital';
import siteRouter from './siteRoute';
import roleRouter from './roleRouter';
import departmentRouter from './departmentRoute';
import adminRouter from './admin';
import { BASE_URL } from '../util/constants';

let rootRouter = Router();

rootRouter.use(`${BASE_URL}/super-admin`, superadminRouter);
rootRouter.use(`${BASE_URL}/hospital`, hospitalRouter);
rootRouter.use(`${BASE_URL}`, siteRouter);
rootRouter.use(`${BASE_URL}`, roleRouter);
rootRouter.use(`${BASE_URL}`, departmentRouter);
rootRouter.use(`${BASE_URL}/admin`, adminRouter);

export default rootRouter;
