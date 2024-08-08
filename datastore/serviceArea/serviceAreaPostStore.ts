import { serviceAreaRepo } from '@typeorm/repositories/serviceAreaRepository';
import { Servicearea } from '@typeorm/entity/servicearea';
import { DefaultJsonResponse } from '@util/responses';
import {
  batchCreateServiceAreaRequestSchema,
  createServiceAreaRequestSchema,
} from '../../schemas/serviceAreaSchemas';
import { z } from 'zod';
import { getServiceAreaCountBySiteIdNameType } from '@datastore/serviceArea/serviceAreaGetStore';
import { EntityManager } from 'typeorm';
import { AppDataSource } from '../../data-source';

export const createServiceArea = async (
  data: z.infer<typeof createServiceAreaRequestSchema>
) => {
  const serviceAreaRepository = serviceAreaRepo();

  // If Service Area already exists in the same site, do no create
  const isUnique = await getServiceAreaCountBySiteIdNameType(
    data.siteId,
    data.name,
    data.type
  );

  if (isUnique >= 1)
    return DefaultJsonResponse(
      'Service Area with NAME and TYPE already exists',
      null,
      false
    );

  const units = await serviceAreaRepository.save(new Servicearea(data));

  return DefaultJsonResponse(
    units
      ? 'New Service Area Created'
      : 'Something happened. Error happened while creating Department',
    null,
    !!units
  );
};

export const batchCreateServiceArea = async (
  requestBody: z.infer<typeof batchCreateServiceAreaRequestSchema>
) => {
  const serviceAreas = requestBody.data.map(
    (serviceArea) =>
      new Servicearea({
        ...serviceArea,
        siteId: requestBody.siteId,
      })
  );

  // Function to check if a service area already exists
  const checkExistencePromises = serviceAreas.map((serviceArea) =>
    getServiceAreaCountBySiteIdNameType(
      serviceArea.siteId,
      serviceArea.name,
      serviceArea.type
    )
  );

  // Resolve all existence checks in parallel
  const existingServiceAreasCounts = await Promise.all(checkExistencePromises);

  // Filter out service areas that already exist
  const uniqueServiceAreas = serviceAreas.filter(
    (_serviceArea, index) => existingServiceAreasCounts[index] === 0
  );

  // Insert the unique service areas
  if (uniqueServiceAreas.length > 0) {
    await AppDataSource.transaction(async (manager: EntityManager) => {
      await manager.save(Servicearea, uniqueServiceAreas);
    });
  }

  return DefaultJsonResponse(
    uniqueServiceAreas.length > 0
      ? `Created ${uniqueServiceAreas.length} Service Areas`
      : 'All Service Areas already exist',
    null,
    uniqueServiceAreas.length > 0
  );
};
