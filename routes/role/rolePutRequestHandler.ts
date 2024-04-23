import { NextFunction, Request, Response, Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { updateRoleDataByRoleId } from '@datastore/role/rolePutStore';
import { createAndUpdateRoleRequestSchema } from '@lib/schemas/roleSchemas';

const rolePutRequest = Router();

rolePutRequest.put(
  '/update/:roleId',
  async (req: Request, res: Response, next: NextFunction) => {
    let message = 'Not Authorised',
      success = false;

    try {
      const requestBody = createAndUpdateRoleRequestSchema.parse({
        ...req.headers,
        ...req.body,
        ...req.params,
      });

      const { roleId, token, ...updateBody } = requestBody;

      const verifiedUser = verifyUserPermission(token, [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]);

      if (!verifiedUser)
        return JsonApiResponse(res, message, success, null, 401);

      const updatedData = await updateRoleDataByRoleId(roleId, updateBody);

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

export default rolePutRequest;
