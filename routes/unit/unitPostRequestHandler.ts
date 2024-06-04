import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import { createNewUnit } from '@datastore/unit/unitPostStore';
import {
  createUnitRequestSchema,
  searchUnitRequestSchema,
} from '@lib/schemas/unitSchemas';
import { authorizeRequest } from '@middlewares/jwt';
import { getSearchUnitData } from '@datastore/unit/unitGetStore';

const unitPostRequest = Router();

// Create New Unit
unitPostRequest.post(
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
      const requestBody = createUnitRequestSchema.parse(req.body);

      const newRole = await createNewUnit(requestBody);

      return JsonApiResponse(
        res,
        newRole.message,
        newRole.success,
        null,
        newRole?.success ? 201 : 500
      );
    } catch (error) {
      next(error);
    }
  }
);

unitPostRequest.post(
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
      const requestBody = searchUnitRequestSchema.parse(req.body);

      const { data, success, message } = await getSearchUnitData(requestBody);

      return JsonApiResponse(
        res,
        message,
        success,
        {
          units: data?.units,
          totalRows: data?.totalRows,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);
export default unitPostRequest;
