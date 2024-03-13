import { BorrowerProfileAlreadyExistsError } from '@/errors/BorrowerProfileAlreadyExistsError';
import { BorrowerProfile } from '@/types/api';
import { createBorrowerProfile } from '@/use-cases/create-borrowing-profile/create-borrower-profile';
import { getLogger, getTracer } from '@/utils/telemetry';
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import { APIGatewayProxyHandler } from 'aws-lambda';

const serviceName = 'CreateBorrowerProfile';

const tracer = getTracer(serviceName);
const logger = getLogger(serviceName);

export const lambdaHandler: APIGatewayProxyHandler = async (event) => {
  const borrowerProfile = JSON.parse(event.body!) as BorrowerProfile;
  try {
    await createBorrowerProfile(borrowerProfile);
    return {
      statusCode: 201,
      body: JSON.stringify({ email: borrowerProfile.email }),
    };
  } catch (e) {
    if (e instanceof BorrowerProfileAlreadyExistsError) {
      return {
        statusCode: 200,
        body: JSON.stringify({ email: borrowerProfile.email }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export const handler = middy(lambdaHandler)
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger));
