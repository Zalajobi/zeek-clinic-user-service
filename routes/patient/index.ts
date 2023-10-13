import { Router } from 'express';
// @ts-ignore
import patientGetRequestHandler from '@routes/patient/patientGetRequestHandler';

const patientRouter = Router();

patientRouter.use('/', patientGetRequestHandler);

export default patientRouter;
