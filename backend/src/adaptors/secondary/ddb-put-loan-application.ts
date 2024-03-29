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
}) => {
  try {
    Log.info(
      `Putting loan application ${loanApplicationId} for borrower ${borrowerEmail}`
    );
    await dynamoDbClient.send(
      new PutItemCommand({
        TableName: Config.FINANCIAL_DATA_TABLE_NAME,
        Item: marshall({
          pk: borrowerEmail,
          sk: `LOAN_APPLICATION#${loanApplicationId}#TIMESTAMP#${timestamp}`,
          loanApplicationId,
          timestamp,
          creditScore,
          grossAnnualIncome,
          monthlyExpenses,
          loanApplicationStatus,
          employmentStatus,
        }),
      })
    );
  } catch (e) {
    throw new InternalError(
      'Failed to put loan application to financial data table'
    );
  }
};
