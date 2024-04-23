import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { updateUnitDataByUnitId } from '@datastore/unit/unitPutStore';
import { updateUnitRequestSchema } from '@lib/schemas/unitSchemas';

const unitPutRequest = Router();

unitPutRequest.put(
  '/update/:unitId',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = updateUnitRequestSchema.parse({
        ...req.headers,
        ...req.body,
        ...req.params,
      });

      const { unitId, token, ...updateBody } = requestBody;

      const verifiedUser = await verifyUserPermission(token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

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
