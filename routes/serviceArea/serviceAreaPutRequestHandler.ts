import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { updateServiceAreaDataByUnitId } from '@datastore/serviceArea/serviceAreaPutStore';
import { updateServiceAreaRequestSchema } from '@lib/schemas/serviceAreaSchemas';
import { authorizeRequest } from '@middlewares/jwt';

const serviceAreaPutRequest = Router();

serviceAreaPutRequest.put(
  '/update/:serviceAreaId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = updateServiceAreaRequestSchema.parse(req.body);

      const { serviceAreaId, ...updateBody } = requestBody;

      const updatedData = await updateServiceAreaDataByUnitId(
        serviceAreaId,
        updateBody
      );

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

export default serviceAreaPutRequest;
