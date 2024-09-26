import {
  AttributeValue,
  DynamoDBClient,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import {
  catchError,
  filter,
  firstValueFrom,
  from,
  interval,
  switchMap,
  takeWhile,
} from 'rxjs';
import { expect } from 'vitest';

interface MatcherResult {
  pass: boolean;
  message: () => string;
  actual?: unknown;
  expected?: unknown;
}

async function queryDynamoDB(
  tableName: string,
  key: Record<string, AttributeValue>
) {
  console.log(tableName, key);
  const command = new GetItemCommand({
    TableName: tableName,
    Key: marshall(key),
  });
  const client = new DynamoDBClient();
  const data = await client.send(command);
  const result = data.Item ? data : null;
  return result;
}

async function pollDynamoDB(
  tableName: string,
  key: Record<string, AttributeValue>,
  pollingIntervalSeconds: number,
  pollingTimeoutSeconds: number
) {
  const startTime = Date.now();
  console.log(`pollingIntervalSeconds ${pollingIntervalSeconds}`);
  const pollObservable = interval(pollingIntervalSeconds * 1000).pipe(
    takeWhile(() => Date.now() - startTime < pollingTimeoutSeconds * 1000),
    switchMap(() => from(queryDynamoDB(tableName, key))),
    filter((result) => result !== null),
    catchError((error) => {
      throw error;
    })
  );
  const result = await firstValueFrom(pollObservable);
  return result;
}

expect.extend({
  async toFindDynamoDBItem(
    received: { key: Record<string, AttributeValue>; tableName: string },
    expected: { pollingIntervalSeconds: number; pollingTimeoutSeconds: number }
  ): Promise<MatcherResult> {
    try {
      const result = await pollDynamoDB(
        received.tableName,
        received.key,
        expected.pollingIntervalSeconds,
        expected.pollingTimeoutSeconds
      );

      if (result) {
        return {
          message: () => 'expected not to find item, but found it',
          pass: true,
        };
      } else {
        return {
          message: () => 'expected to find item, but it was not found',
          pass: false,
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          message: () => `an error occurred while querying DynamoDB: ${error}`,
          pass: false,
        };
      } else {
        return {
          message: () => 'An unknown error occurred while querying DynamoDB',
          pass: false,
        };
      }
    }
  },
});
