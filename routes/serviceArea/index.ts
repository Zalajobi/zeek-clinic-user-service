import { Router } from 'express';
// @ts-ignore
import serviceAreaGetRequest from '@routes/serviceArea/serviceAreaGetRequestHandler';

const serviceAreaRouter = Router();

serviceAreaRouter.use('/', serviceAreaGetRequest);

export default serviceAreaRouter;
