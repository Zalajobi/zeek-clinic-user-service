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
// @ts-ignore
import patientRouter from '@routes/patient';
// @ts-ignore
import unitRouter from '@routes/unit';
// @ts-ignore
import serviceAreaRouter from '@routes/serviceArea';

let rootRouter = Router();

rootRouter.use(`${BASE_URL}/super-admin`, superadminRouter);
rootRouter.use(`${BASE_URL}/hospital`, hospitalRouter);
rootRouter.use(`${BASE_URL}/site`, siteRouter);
rootRouter.use(`${BASE_URL}/role`, roleRouter);
rootRouter.use(`${BASE_URL}/department`, departmentRouter);
rootRouter.use(`${BASE_URL}/unit`, unitRouter);
rootRouter.use(`${BASE_URL}/service-area`, serviceAreaRouter);
rootRouter.use(`${BASE_URL}/admin`, adminRouter);
rootRouter.use(`${BASE_URL}/providers`, providersRouter);
rootRouter.use(`${BASE_URL}/patients`, patientRouter);

export default rootRouter;
