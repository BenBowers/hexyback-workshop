import {
  BorrowingCapacityGetParams,
  BorrowingCapacityResponse,
} from '@/types/api';
import calculateBorrowingCapacity from '@/use-cases/calculate-borrowing-capacity';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const { age, grossIncome, employmentStatus } =
    event.queryStringParameters as unknown as BorrowingCapacityGetParams;
  const borrowingCapacity = calculateBorrowingCapacity({
    age,
    grossIncome,
    employmentStatus,
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      estimatedBorrowingCapacity: borrowingCapacity,
    } as BorrowingCapacityResponse),
  };
};
