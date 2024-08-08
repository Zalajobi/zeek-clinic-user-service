import { NextFunction, Request, Response, Router } from 'express';
import { authorizeRequest } from '@middlewares/auth';
import { updateSiteRequestSchema } from '../../schemas/siteSchemas';
import { JsonApiResponse } from '@util/responses';
import { updateSingleSiteById } from '@datastore/site/sitePutStore';

const sitePutRequestHandler = Router();

sitePutRequestHandler.put(
  '/update/:id',
  authorizeRequest(['SUPER_ADMIN', 'HOSPITAL_ADMIN']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, ...updateBody } = updateSiteRequestSchema.parse({
        ...req.params,
        ...req.body,
      });

      // Call to update site
      await updateSingleSiteById(id, updateBody);

      return JsonApiResponse(res, 'Site Updated Successfully', true, {}, 202);
    } catch (error) {
      next(error);
    }
  }
);

export default sitePutRequestHandler;
