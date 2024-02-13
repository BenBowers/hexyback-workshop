import { BorrowingCapacityResponse } from '@/types/api';
import { APIGatewayProxyHandler } from 'aws-lambda';
export const handler: APIGatewayProxyHandler = async (event) => {
  const params = event.queryStringParameters;
  console.log(params);

  return {
    statusCode: 200,
    body: JSON.stringify({
      estimatedBorrowingCapacity: 5000,
    } as BorrowingCapacityResponse),
  };
};
