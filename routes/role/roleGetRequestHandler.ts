import { Router } from 'express';
import { verifyUserPermission } from '@lib/auth';
import { JsonApiResponse } from '@util/responses';
import { getRolePaginationDataWithUsersCount } from '@datastore/role/roleGetStore';

const roleGetRequest = Router();

roleGetRequest.get(`/admin/list/paginated/:siteId`, async (req, res) => {
  const siteId = req.params.siteId as string;
  let message = 'Not Authorised',
    success = false;

  try {
    const verifiedUser = await verifyUserPermission(
      req?.headers?.token as string,
      [
        'SUPER_ADMIN',
        'HOSPITAL_ADMIN',
        'SITE_ADMIN',
        'ADMIN',
        'HUMAN_RESOURCES',
      ]
    );

    const { page, per_page, from_date, to_date, search, country, status } =
      req.query;

    if (!verifiedUser) return JsonApiResponse(res, message, success, null, 401);

    const roleData = await getRolePaginationDataWithUsersCount(
      page as unknown as number,
      per_page as unknown as number,
      search as unknown as string,
      from_date as unknown as string,
      to_date as unknown as string,
      siteId as string
    );

    if (roleData.success)
      return JsonApiResponse(
        res,
        roleData.message,
        <boolean>roleData?.success,
        {
          role: roleData.data[0],
          count: roleData.data[1],
        },
        200
      );

    return JsonApiResponse(res, 'Something went wrong', success, null, 200);
  } catch (error) {
    if (error instanceof Error) message = error.message;

    return JsonApiResponse(res, message, success, null, 500);
  }
});

export default roleGetRequest;
