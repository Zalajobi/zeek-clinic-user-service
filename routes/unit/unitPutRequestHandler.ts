import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { updateUnitDataByUnitId } from '@datastore/unit/unitPutStore';
import { updateUnitRequestSchema } from '@lib/schemas/unitSchemas';
import { authorizeRequest } from '@middlewares/jwt';

const unitPutRequest = Router();

unitPutRequest.put(
  '/update/:unitId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = updateUnitRequestSchema.parse({
        ...req.headers,
        ...req.body,
        ...req.params,
      });

      const { unitId, authorization, ...updateBody } = requestBody;
      const updatedData = await updateUnitDataByUnitId(unitId, updateBody);

      return JsonApiResponse(
        res,
        updatedData.message,
        updatedData.success as boolean,
        null,
        updatedData?.success ? 200 : 400
      );
    } catch (error) {
      next(error);
    }
  }
);

export default unitPutRequest;
