import { ApplyForLoanResponse } from '@/types/api';
import { assessLoanApplication } from '@/use-cases/loan-assessment/assess-loan-application';
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

const serviceName = 'ApplyForLoan';

const tracer = new Tracer({
  serviceName,
  captureHTTPsRequests: true,
  enabled: true,
});

const logger = new Logger();

export const lambdaHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const { age, grossIncome, employmentStatus, monthlyExpenses, creditScore } =
    JSON.parse(event.body as string);
  const loanApplicationStatus = await assessLoanApplication({
    age,
    grossIncome,
    employmentStatus,
    monthlyExpenses,
    creditScore,
  });
  return {
    statusCode: 200,
    body: JSON.stringify({
      loanApplicationStatus,
    } as ApplyForLoanResponse),
  };
};

export const handler = middy(lambdaHandler)
  .use(captureLambdaHandler(tracer))
  .use(injectLambdaContext(logger));
