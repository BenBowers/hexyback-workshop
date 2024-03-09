import {
  BorrowingCapacityGetParams,
  BorrowingCapacityResponse,
} from '@/types/api';
import { calculateBorrowingCapacity } from '@/use-cases/calculate-borrowing-capacity';
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

const serviceName = 'GetBorrowingPower';

const tracer = new Tracer({
  serviceName,
  captureHTTPsRequests: true,
  enabled: true,
});

const logger = new Logger();

export const lambdaHandler: APIGatewayProxyHandler = async (
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

export const handler = middy(lambdaHandler)
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger));
