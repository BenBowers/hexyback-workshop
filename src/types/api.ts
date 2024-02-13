import { components, paths } from '@openapi';
export type BorrowingCapacityGetParams =
  paths['/borrowingCapacity']['get']['parameters']['query'];
export type EmploymentStatus = components['schemas']['EmploymentStatus'];
export type BorrowingCapacityResponse =
  paths['/borrowingCapacity']['get']['responses']['200']['content']['application/json'];
