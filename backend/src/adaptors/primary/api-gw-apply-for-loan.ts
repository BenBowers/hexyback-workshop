import { BorrowerProfileDoesNotExistError } from '@/errors/BorrowerProfileDoesNotExistError';
import { ApplyForLoanResponse, LoanApplication } from '@/types/api';
import { processLoanApplication } from '@/use-cases/loan-assessment/process-loan-application';
import { getLogger, getTracer } from '@/utils/telemetry';
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

const serviceName = 'ApplyForLoan';

const tracer = getTracer(serviceName);
const logger = getLogger(serviceName);

export const lambdaHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {};

export const handler = middy(lambdaHandler)
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger));
