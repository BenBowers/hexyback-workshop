import { BorrowerProfileDoesNotExistError } from '@/errors/BorrowerProfileDoesNotExistError';
import {
  BorrowingCapacityGetParams,
  BorrowingCapacityResponse,
} from '@/types/api';
import { calculateBorrowingCapacity } from '@/use-cases/borrowing-capacity/calculate-borrowing-capacity';
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
  try {
    const { borrowerEmail, grossAnnualIncome, employmentStatus } =
      event.queryStringParameters as unknown as BorrowingCapacityGetParams;
    const borrowingCapacity = await calculateBorrowingCapacity({
      borrowerEmail,
      grossAnnualIncome,
      employmentStatus,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        estimatedBorrowingCapacity: borrowingCapacity,
      } as BorrowingCapacityResponse),
    };
  } catch (error) {
    if (error instanceof BorrowerProfileDoesNotExistError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Borrower with the provided email does not exist',
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};

export const handler = middy(lambdaHandler)
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger));
