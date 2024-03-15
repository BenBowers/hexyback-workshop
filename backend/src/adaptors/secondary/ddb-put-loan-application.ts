import { InternalError } from '@/errors/InternalError';
import { PutLoanApplicationPort } from '@/ports/secondary/DynamoDBPutLoanApplication';
import { Log, getTracer } from '@/utils/telemetry';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Config } from 'sst/node/config';

const dynamoDbClient = getTracer().captureAWSv3Client(new DynamoDBClient({}));
export const putLoanApplication: PutLoanApplicationPort = async ({
  borrowerEmail,
  loanApplicationId,
  timestamp,
  creditScore,
  grossAnnualIncome,
  monthlyExpenses,
  loanApplicationStatus,
  employmentStatus,
}) => {};
