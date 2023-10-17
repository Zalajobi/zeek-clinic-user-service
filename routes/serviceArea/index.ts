import { Router } from 'express';
import serviceAreaGetRequest from '@routes/serviceArea/serviceAreaGetRequestHandler';
import serviceAreaPutRequest from '@routes/serviceArea/serviceAreaPutRequestHandler';

const serviceAreaRouter = Router();

serviceAreaRouter.use('/', serviceAreaGetRequest);
serviceAreaRouter.use('/', serviceAreaPutRequest);

export default serviceAreaRouter;
