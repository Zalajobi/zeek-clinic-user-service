import { ServiceAreaType } from '@typeorm/entity/enums';

export type CreateServiceAreaDataProps = {
  siteId: string;
  name: string;
  description: string;
  type: ServiceAreaType;
};
