import { InternalError } from '@/errors/InternalError';
import { PutLoanApplicationInput } from '@/ports/secondary/DynamoDBPutLoanApplication';
import {
  DynamoDBClient,
  DynamoDBServiceException,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { putLoanApplication } from './ddb-put-loan-application';

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
    borrowerEmail: 'john.doe@example.com',
    creditScore: 700,
    employmentStatus: 'FULL_TIME',
    grossAnnualIncome: 100000,
    loanApplicationId: 'd5fe6ff5-20b3-4581-b38f-9b034c20d783',
    loanApplicationStatus: 'APPROVED',
    monthlyExpenses: 5000,
    timestamp: '2024-03-15T00:00:00.000Z',
  };

<<<<<<< HEAD
  it('throws an InternalError when the dynamodb client rejects for any reason', async () => {
    dynamoDbMock.rejects(
      new DynamoDBServiceException({
        message: 'something went wrong',
        $metadata: {},
        name: 'ServiceException',
        $fault: 'client',
      })
    );
    await expect(putLoanApplication(loanApplication)).rejects.toBeInstanceOf(
      InternalError
    );
  });
=======
  it.todo(
    'throws an InternalError when the dynamodb client rejects for any reason',
    async () => {}
  );
>>>>>>> b68768227ce2f955339505e0860db375d7e59eb0
});
