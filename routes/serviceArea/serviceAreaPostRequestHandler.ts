import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import {
  batchCreateServiceArea,
  createServiceArea,
} from '@datastore/serviceArea/serviceAreaPostStore';
import {
  batchCreateServiceAreaRequestSchema,
  createServiceAreaRequestSchema,
  searchServiceAreaRequestSchema,
} from '../../schemas/serviceAreaSchemas';
import { authorizeRequest } from '@middlewares/jwt';
import { getSearchServiceAreaData } from '@datastore/serviceArea/serviceAreaGetStore';

const serviceAreaPostRequest = Router();

serviceAreaPostRequest.post(
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
      const requestBody = createServiceAreaRequestSchema.parse(req.body);

      const newRole = await createServiceArea(requestBody);
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

serviceAreaPostRequest.post(
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
      const requestBody = searchServiceAreaRequestSchema.parse(req.body);

      const { data, message, success } = await getSearchServiceAreaData(
        requestBody
      );

      return JsonApiResponse(
        res,
        message,
        success,
        {
          serviceAreas: data?.serviceAreas,
          totalRows: data?.totalRows,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

serviceAreaPostRequest.post(
  '/create/batch',
  authorizeRequest([
    'SUPER_ADMIN',
    'HOSPITAL_ADMIN',
    'SITE_ADMIN',
    'ADMIN',
    'HUMAN_RESOURCES',
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestBody = batchCreateServiceAreaRequestSchema.parse(req.body);

      const { data, message, success } = await batchCreateServiceArea(
        requestBody
      );

      return JsonApiResponse(res, message, success, data, success ? 201 : 400);
    } catch (error) {
      next(error);
    }
  }
);

export default serviceAreaPostRequest;
