import { Router } from 'express';
import superadminRouter from '@routes/superadmin';
import { BASE_URL } from '@util/constants';
import siteRouter from '@routes/site';
import hospitalRouter from '@routes/hospital';
import roleRouter from '@routes/role';
import departmentRouter from '@routes/department';
import adminRouter from '@routes/admin';
import providersRouter from '@routes/providers';
import patientRouter from '@routes/patient';
import unitRouter from '@routes/unit';
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
rootRouter.use(`${BASE_URL}/provider`, providersRouter);
rootRouter.use(`${BASE_URL}/patient`, patientRouter);

export default rootRouter;
