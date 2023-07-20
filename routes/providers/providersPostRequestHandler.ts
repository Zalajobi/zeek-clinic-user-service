import { Router } from 'express';
import { verifyUserPermission } from '../../lib/auth';

const providersPostRequestHandler = Router();

providersPostRequestHandler.post(
  '/admin/create-new/provider',
  async (req, res) => {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'SITE_ADMIN']
    );
  }
);

export default providersPostRequestHandler;
