import { Router } from 'express';
import serviceAreaGetRequest from '@routes/serviceArea/serviceAreaGetRequestHandler';

const serviceAreaRouter = Router();

serviceAreaRouter.use('/', serviceAreaGetRequest);

export default serviceAreaRouter;
