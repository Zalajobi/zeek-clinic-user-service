import { Router } from 'express';
// @ts-ignore
import patientGetRequestHandler from '@routes/patient/patientGetRequestHandler';
// @ts-ignore
import patientPutRequestHandler from '@routes/patient/patientPutRequestHandler';

const patientRouter = Router();

patientRouter.use('/', patientGetRequestHandler);
patientRouter.use('/', patientPutRequestHandler);

export default patientRouter;
