import { BadRequestError } from '@/errors/BadRequestError';
import {
  CreateBorrowerProfileCommandInput,
  createEventBridgeClient,
} from '@/utils/create-event-bridge-client';
import { describe, expect, it } from 'vitest';

describe.concurrent('event-bridge-create-borrower-profile', () => {
  it('it throws an Bad Request error given the user does not provide a valid borrower profile', () => {
    const eventBridgeClient = createEventBridgeClient();
    const createBorrowerProfileCommandInput =
      {} as unknown as CreateBorrowerProfileCommandInput;
    expect(
      eventBridgeClient.createBorrowerProfile(createBorrowerProfileCommandInput)
    ).rejects.toThrow(new BadRequestError('Invalid Borrower Profile'));
  });
  it.todo(
    'creates a borrower profile when a create borrower profile command is published',
    () => {}
  );
});
