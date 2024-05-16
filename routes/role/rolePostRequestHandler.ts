import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { createNewRole } from '@datastore/role/rolePostStore';
import {
  createAndUpdateRoleRequestSchema,
  searchRoleRequestSchema,
} from '@lib/schemas/roleSchemas';
import { authorizeRequest } from '@middlewares/jwt';
import { getSearchUnitData } from '@datastore/unit/unitGetStore';
import { getSearchRoleData } from '@datastore/role/roleGetStore';

const rolePostRequest = Router();

rolePostRequest.post(
  '/create',
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
        ...req.body,
        ...req.headers,
      });

      const newRole = await createNewRole(requestBody);

      return JsonApiResponse(
        res,
        newRole.message,
        <boolean>newRole.success,
        null,
        newRole?.success ? 201 : 500
      );
    } catch (error) {
      next(error);
    }
  }
);

rolePostRequest.post(
  '/search',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = searchRoleRequestSchema.parse(req.body);

      const queryData = await getSearchRoleData(requestBody);

      return JsonApiResponse(
        res,
        'Success',
        true,
        {
          roles: queryData[0],
          totalRows: queryData[1],
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

export default rolePostRequest;
