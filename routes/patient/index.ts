import { Router } from 'express';
import patientGetRequestHandler from '@routes/patient/patientGetRequestHandler';
import patientPutRequestHandler from '@routes/patient/patientPutRequestHandler';
import patientPostRequestHandler from '@routes/patient/patientPostRequestHandler';

const patientRouter = Router();

patientRouter.use('/', patientGetRequestHandler);
patientRouter.use('/', patientPutRequestHandler);
patientRouter.use('/', patientPostRequestHandler);

export default patientRouter;
