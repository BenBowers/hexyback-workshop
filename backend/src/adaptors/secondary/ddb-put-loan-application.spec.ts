import { InternalError } from '@/errors/InternalError';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PutLoanApplicationInput,
  putLoanApplication,
} from './ddb-put-loan-application';

describe('ddb-put-loan-application', () => {
  vi.mock('sst/node/config', () => ({
    Config: {
      FINANCIAL_DATA_TABLE_NAME: 'financial-data-table',
    },
  }));
  const dynamoDbMock = mockClient(DynamoDBClient);

  beforeEach(() => {
    dynamoDbMock.reset();
  });

  const loanApplication: PutLoanApplicationInput = {
    borrowerEmail: 'john.doe@example',
    creditScore: 700,
    employmentStatus: 'FULL_TIME',
    grossAnnualIncome: 100000,
    loanApplicationId: 'd5fe6ff5-20b3-4581-b38f-9b034c20d783',
    loanApplicationStatus: 'APPROVED',
    monthlyExpenses: 5000,
    timestamp: '2024-03-15T00:00:00.000Z',
  };

  it('throws an InternalError when the dynamodb client rejects for any reason', async () => {
    dynamoDbMock.rejects(new Error('Cheers Kent'));
    await expect(putLoanApplication(loanApplication)).rejects.toBeInstanceOf(
      InternalError
    );
  });
  it(
    'calls the dynamo db client with a put item command passing it the financial data table name ' +
      'and a marshalled loan application containing a partition key of the borrowers email ' +
      'and a sort key of the loan application id and timestamp',
    async () => {
      await putLoanApplication(loanApplication);
      expect(dynamoDbMock).toHaveReceivedCommandWith(PutItemCommand, {
        TableName: 'financial-data-table',
        Item: {
          pk: { S: 'john.doe@example' },
          sk: {
            S:
              `LOAN_APPLICATION#${loanApplication.loanApplicationId}` +
              `#TIMESTAMP#${loanApplication.timestamp}`,
          },
          loanApplicationId: { S: loanApplication.loanApplicationId },
          timestamp: { S: loanApplication.timestamp },
          creditScore: { N: '700' },
          grossAnnualIncome: { N: '100000' },
          monthlyExpenses: { N: '5000' },
          loanApplicationStatus: { S: 'APPROVED' },
          employmentStatus: { S: 'FULL_TIME' },
        },
      });
    }
  );
});
