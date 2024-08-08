import { NextFunction, Request, Response, Router } from 'express';
import { JsonApiResponse } from '@util/responses';
import {
  batchCreateDepartment,
  createNewDepartment,
} from '@datastore/department/departmentPostStore';
import {
  createBulkDepartmentRequestSchema,
  createDepartmentRequestSchema,
  searchDepartmentRequestSchema,
} from '../../schemas/departmentSchemas';
import { authorizeRequest } from '@middlewares/auth';
import { getSearchDepartmentData } from '@datastore/department/departmentGetStore';

const departmentPostRequest = Router();

departmentPostRequest.post(
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
      const requestBody = createDepartmentRequestSchema.parse(req.body);

      const newRole = await createNewDepartment(requestBody);

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

departmentPostRequest.post(
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
      const requestBody = searchDepartmentRequestSchema.parse(req.body);

      const { data, success, message } = await getSearchDepartmentData(
        requestBody
      );

      return JsonApiResponse(
        res,
        message,
        success,
        {
          depts: data?.departments,
          totalRows: data?.totalRows,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  }
);

departmentPostRequest.post(
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
      const requestBody = createBulkDepartmentRequestSchema.parse(req.body);

      const { data, message, success } = await batchCreateDepartment(
        requestBody
      );

      return JsonApiResponse(res, message, success, data, success ? 201 : 400);
    } catch (error) {
      next(error);
    }
  }
);

export default departmentPostRequest;
