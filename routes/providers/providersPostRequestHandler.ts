import { Router } from 'express';

const providersPostRequestHandler = Router();

providersPostRequestHandler.post('/admin/create-new/provider');

export default providersPostRequestHandler;
