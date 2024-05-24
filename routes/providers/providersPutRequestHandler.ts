import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { generatePasswordHash, remapObjectKeys } from '@util/index';
import { updateProviderDetails } from '@datastore/provider/providerPutStore';
import { updateProviderRequestSchema } from '@lib/schemas/providerSchemas';
import { authorizeRequest } from '@middlewares/jwt';

const providersPutRequestHandler = Router();

providersPutRequestHandler.put(
  '/update/:id/:site',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, site, ...updateData } = updateProviderRequestSchema.parse({
        ...req.params,
        ...req.body,
      });

      if (updateData?.password) {
        updateData.password = generatePasswordHash(updateData.password);
      }

      const updateProviderResponse = await updateProviderDetails(
        id,
        site,
        updateData
      );

      return JsonApiResponse(
        res,
        updateProviderResponse.message,
        <boolean>updateProviderResponse.success,
        null,
        updateProviderResponse.success ? 200 : 500
      );
    } catch (error) {
      next(error);
    }
  }
);

export default providersPutRequestHandler;
