import { NextFunction, Request, Response, Router } from 'express';
import { authorizeRequest } from '@middlewares/jwt';
import { deleteSingleSiteById } from '@datastore/site/siteDeleteStore';
import { JsonApiResponse } from '@util/responses';
import { idRequestSchema } from '@lib/schemas/commonSchemas';

const siteDeleteRequest = Router();

siteDeleteRequest.delete(
  '/delete/:id',
  authorizeRequest(['SUPER_ADMIN', 'HOSPITAL_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = idRequestSchema.parse(req.params);

      const { affected } = await deleteSingleSiteById(requestBody.id);

      return JsonApiResponse(
        res,
        affected === 1 ? 'Site Deleted Successfully' : 'Failed To Delete Site',
        affected === 1,
        {},
        affected === 1 ? 202 : 400
      );
    } catch (error) {
      next(error);
    }
  }
);

export default siteDeleteRequest;
