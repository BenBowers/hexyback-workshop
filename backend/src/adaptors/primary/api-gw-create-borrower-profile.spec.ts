import { BorrowerProfileAlreadyExistsError } from '@/errors/BorrowerProfileAlreadyExistsError';
import { InternalError } from '@/errors/InternalError';
import { BorrowerProfile } from '@/types/api';
import { createBorrowerProfile } from '@/use-cases/create-borrowing-profile/create-borrower-profile';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { beforeEach } from 'node:test';
import { describe, expect, it, vi } from 'vitest';
import { lambdaHandler } from './api-gw-create-borrower-profile';

describe('api-gw-create-borrower-profile', () => {
  vi.mock(
    '@/use-cases/create-borrowing-profile/create-borrower-profile',
    () => ({ createBorrowerProfile: vi.fn() })
  );
  const createBorrowerProfileSpy = vi.mocked(createBorrowerProfile);
  beforeEach(() => {
    vi.resetAllMocks();
  });
  const borrowerProfile: BorrowerProfile = {
    creditScore: 500,
    dob: '1981-11-02',
    email: 'john.doe@example.com',
    name: 'John Doe',
  };
  const context = {} as Context;
  const noop = () => {};
  describe('given an api gateway proxy event with a borrower profile in the body', () => {
    it('calls the create borrower profile use case with the borrower profile', async () => {
      await lambdaHandler(
        {
          body: JSON.stringify(borrowerProfile),
        } as APIGatewayProxyEvent,
        context,
        noop
      );
      expect(createBorrowerProfileSpy).toHaveBeenCalledWith(borrowerProfile);
    });
    describe('given the use case resolves', () => {
      it('returns a 201 Created status code and the borrower profile email in the body', async () => {
        createBorrowerProfileSpy.mockResolvedValue(borrowerProfile);
        expect(
          lambdaHandler(
            {
              body: JSON.stringify(borrowerProfile),
            } as APIGatewayProxyEvent,
            context,
            noop
          )
        ).resolves.toEqual({
          statusCode: 201,
          body: JSON.stringify({ email: borrowerProfile.email }),
        });
      });
    });
    describe('given the use case rejects with a borrower profile already exists error', () => {
      it('returns a 200 OK status code and the borrower profile email in the body', async () => {
        createBorrowerProfileSpy.mockRejectedValue(
          new BorrowerProfileAlreadyExistsError(
            'Borrower profile already exists'
          )
        );
        expect(
          lambdaHandler(
            {
              body: JSON.stringify(borrowerProfile),
            } as APIGatewayProxyEvent,
            context,
            noop
          )
        ).resolves.toEqual({
          statusCode: 200,
          body: JSON.stringify({ email: borrowerProfile.email }),
        });
      });
    });
    describe('given the use case rejects with an unhandled error', () => {
      it('returns a 500 Internal Server Error status code and a message in the body', async () => {
        createBorrowerProfileSpy.mockRejectedValue(
          new InternalError('something went wrong')
        );
        expect(
          lambdaHandler(
            {
              body: JSON.stringify(borrowerProfile),
            } as APIGatewayProxyEvent,
            context,
            noop
          )
        ).resolves.toEqual({
          statusCode: 500,
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      });
    });
  });
});
