import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { updateServiceAreaDataByUnitId } from '@datastore/serviceArea/serviceAreaPutStore';
import { updateServiceAreaRequestSchema } from '@lib/schemas/serviceAreaSchemas';

const serviceAreaPutRequest = Router();

serviceAreaPutRequest.put(
  '/update/:serviceAreaId',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = updateServiceAreaRequestSchema.parse({
        ...req.headers,
        ...req.body,
        ...req.params,
      });

      const { serviceAreaId, token, ...updateBody } = requestBody;

      const verifiedUser = await verifyUserPermission(token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

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
