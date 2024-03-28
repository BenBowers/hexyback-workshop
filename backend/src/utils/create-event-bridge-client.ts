import { BadRequestError } from '@/errors/BadRequestError';
import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import { EventBus } from 'sst/node/event-bus';

const awsEventBridgeClient: EventBridgeClient = new EventBridgeClient();

export type CreateBorrowerProfileCommandInput = {
  name: string;
  email: string;
  dob: string;
  creditScore: number;
};

const isInstanceOfCreateBorrowerProfileCommandInput = (
  obj: object
): obj is CreateBorrowerProfileCommandInput => {
  return (
    typeof obj === 'object' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'email' in obj &&
    typeof obj.email === 'string' &&
    'dob' in obj &&
    typeof obj.dob === 'string' &&
    'creditScore' in obj &&
    typeof obj.creditScore === 'number'
  );
};
export const createEventBridgeClient = () => {
  return {
    createBorrowerProfile: async (
      createBorrowerProfileCommandInput: CreateBorrowerProfileCommandInput
    ) => {
      if (
        !isInstanceOfCreateBorrowerProfileCommandInput(
          createBorrowerProfileCommandInput
        )
      ) {
        throw new BadRequestError('Invalid Borrower Profile');
      }
      await awsEventBridgeClient.send(
        new PutEventsCommand({
          Entries: [
            {
              Detail: JSON.stringify(createBorrowerProfileCommandInput),
              DetailType: 'Create Borrower Profile Command',
              EventBusName: EventBus.BorrowerProfile.eventBusName,
              Resources: [],
              Source: 'Event Bridge Client',
            },
          ],
        })
      );
    },
  };
};
