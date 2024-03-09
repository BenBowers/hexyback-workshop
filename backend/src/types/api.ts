import { components, paths } from '@openapi';
export type BorrowingCapacityGetParams =
  paths['/borrowingCapacity']['get']['parameters']['query'];
export type EmploymentStatus = components['schemas']['EmploymentStatus'];
export type BorrowingCapacityResponse =
  paths['/borrowingCapacity']['get']['responses']['200']['content']['application/json'];
export type ApplyForLoanRequestBody =
  paths['/loan']['post']['requestBody']['content']['application/json'];
export type ApplyForLoanResponse =
  paths['/loan']['post']['responses']['200']['content']['application/json'];
