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
) => {
  try {
    const {
      grossAnnualIncome,
      employmentStatus,
      monthlyExpenses,
      borrowerEmail,
    } = JSON.parse(event.body!) as LoanApplication;
    const loanApplicationStatus = await processLoanApplication({
      grossAnnualIncome,
      employmentStatus,
      monthlyExpenses,
      borrowerEmail,
    });
    return {
      statusCode: 201,
      body: JSON.stringify({
        loanApplicationStatus,
      } as ApplyForLoanResponse),
    };
  } catch (e) {
    if (e instanceof BorrowerProfileDoesNotExistError) {
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