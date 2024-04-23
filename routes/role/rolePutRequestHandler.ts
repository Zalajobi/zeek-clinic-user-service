import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { updateRoleDataByRoleId } from '@datastore/role/rolePutStore';
import { createAndUpdateRoleRequestSchema } from '@lib/schemas/roleSchemas';
import { authorizeRequest } from '@middlewares/jwt';

const rolePutRequest = Router();

rolePutRequest.put(
  '/update/:roleId',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = createAndUpdateRoleRequestSchema.parse({
        ...req.headers,
        ...req.body,
        ...req.params,
      });

      const { roleId, token, ...updateBody } = requestBody;

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
