import { Router } from 'express';

const providersGetRequestHandler = Router();

providersGetRequestHandler.get(`/site`);

export default providersGetRequestHandler;
