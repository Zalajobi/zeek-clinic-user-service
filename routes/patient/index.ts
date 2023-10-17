import { Router } from 'express';
import patientGetRequestHandler from '@routes/patient/patientGetRequestHandler';
import patientPutRequestHandler from '@routes/patient/patientPutRequestHandler';

const patientRouter = Router();

patientRouter.use('/', patientGetRequestHandler);
patientRouter.use('/', patientPutRequestHandler);

export default patientRouter;
