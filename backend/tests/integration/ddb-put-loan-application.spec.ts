import { putLoanApplication } from '@/adaptors/secondary/ddb-put-loan-application';
import { PutLoanApplicationInput } from '@/ports/secondary/DynamoDBPutLoanApplication';
import {
  DeleteItemCommand,
  DynamoDBClient,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { randomUUID } from 'crypto';
import { Config } from 'sst/node/config';
import { afterEach, describe, expect, it } from 'vitest';

describe('ddb-put-loan-application', () => {
  const financialDataTableName = Config.FINANCIAL_DATA_TABLE_NAME;
  const client = new DynamoDBClient({});
  const getLoanApplication = (email: string, loanApplicationId: string) =>
    client
      .send(
        new QueryCommand({
          TableName: financialDataTableName,
          KeyConditions: {
            pk: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [{ S: email }],
            },
            sk: {
              ComparisonOperator: 'BEGINS_WITH',
              AttributeValueList: [
                {
                  S: `LOAN_APPLICATION#${loanApplicationId}`,
                },
              ],
            },
          },
        })
      )
      .then(({ Items }) => (Items?.length ? unmarshall(Items[0]!) : undefined));
  const deleteLoanApplication = (email: string, loanApplicationId: string) =>
    getLoanApplication(email, loanApplicationId).then(
      async (loanApplication) => {
        if (loanApplication) {
          await client.send(
            new DeleteItemCommand({
              TableName: financialDataTableName,
              Key: marshall({
                pk: email,
                sk:
                  `LOAN_APPLICATION#${loanApplicationId}` +
                  `#TIMESTAMP#${loanApplication.timestamp}`,
              }),
            })
          );
        }
      }
    );
  const loanApplication: PutLoanApplicationInput = {
    borrowerEmail: `loan-application-ddb+${randomUUID()}@example.com`,
    loanApplicationId: randomUUID(),
    timestamp: new Date().toISOString(),
    creditScore: 700,
    grossAnnualIncome: 100000,
    monthlyExpenses: 5000,
    loanApplicationStatus: 'APPROVED',
    employmentStatus: 'FULL_TIME',
  };
  afterEach(async () => {
    await deleteLoanApplication(
      loanApplication.borrowerEmail,
      loanApplication.loanApplicationId
    );
  });
  it.todo(
    'writes a loan application record with ' +
      'PK of email and SK of LOAN_APPLICATION#loanApplicationId#TIMESTAMP#timestamp ' +
      'given a valid loan application',
    async () => {}
  );
});
