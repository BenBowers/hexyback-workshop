import { BadRequestError } from '@/errors/BadRequestError';
import {
  CreateBorrowerProfileCommandInput,
  createEventBridgeClient,
} from '@/utils/create-event-bridge-client';
import { Config } from 'sst/node/config';
import { describe, expect, it } from 'vitest';

describe.concurrent.only('event-bridge-create-borrower-profile', () => {
  it('it throws an Bad Request error given the user does not provide a valid borrower profile', () => {
    const eventBridgeClient = createEventBridgeClient();
    const createBorrowerProfileCommandInput =
      {} as unknown as CreateBorrowerProfileCommandInput;
    expect(
      eventBridgeClient.createBorrowerProfile(createBorrowerProfileCommandInput)
    ).rejects.toThrow(new BadRequestError('Invalid Borrower Profile'));
  });
  it('creates a borrower profile when a create borrower profile command is published', async () => {
    const eventBridgeClient = createEventBridgeClient();
    eventBridgeClient.createBorrowerProfile({
      creditScore: 500,
      dob: '1990-12-05',
      email: 'you@them.net',
      name: 'Ronald Weasley',
    });
    await expect({
      key: { pk: 'you@them.net', sk: 'BORROWER' },
      tableName: Config.FINANCIAL_DATA_TABLE_NAME,
    }).toFindDynamoDBItem({
      pollingIntervalSeconds: 1,
      pollingTimeoutSeconds: 10,
    });
  });
});
