import { Router } from 'express';
import serviceAreaGetRequest from '@routes/serviceArea/serviceAreaGetRequestHandler';
import serviceAreaPutRequest from '@routes/serviceArea/serviceAreaPutRequestHandler';
import serviceAreaPostRequest from '@routes/serviceArea/serviceAreaPostRequestHandler';

const serviceAreaRouter = Router();

serviceAreaRouter.use('/', serviceAreaGetRequest);
serviceAreaRouter.use('/', serviceAreaPutRequest);
serviceAreaRouter.use('/', serviceAreaPostRequest);

export default serviceAreaRouter;
