import { BorrowingCapacityGetParams } from '@/types/api';
import { paths } from '@openapi';
import openApiFetch from 'openapi-fetch';
import { Config } from 'sst/node/config';
import { describe, expect, it } from 'vitest';
const baseUrl = Config.API_ENDPOINT;
const apiToken = Config.API_KEY;
describe.concurrent('api-aw-calculate-borrowing-power', () => {
  const apiClient = openApiFetch<paths>({
    baseUrl: baseUrl,
  });
  it('responds with 401 Unauthorized given the user does not provide a authorization token', async () => {
    await expect(
      apiClient.GET('/borrowingCapacity', {
        params: {
          query: {} as BorrowingCapacityGetParams,
        },
      })
    ).resolves.toEqual({
      error: {
        message: 'Unauthorized',
      },
      response: expect.objectContaining({
        status: 401,
        statusText: 'Unauthorized',
      }),
    });
  });
  it('responds with 403 Forbidden given the user provides an invalid authorization token', async () => {
    await expect(
      apiClient.GET('/borrowingCapacity', {
        headers: {
          authorization: 'invalid',
        },
        params: {
          query: {} as BorrowingCapacityGetParams,
        },
      })
    ).resolves.toEqual({
      error: {
        Message:
          'User is not authorized to access this resource with an explicit deny',
      },
      response: expect.objectContaining({
        status: 403,
        statusText: 'Forbidden',
      }),
    });
  });
  it('responds with a 400 Bad Request given the user is authenticated but does not provide the required query params', async () => {
    await expect(
      apiClient.GET('/borrowingCapacity', {
        headers: {
          authorization: apiToken,
        },
        params: {
          query: {} as BorrowingCapacityGetParams,
        },
      })
    ).resolves.toEqual({
      error: {
        message:
          'Missing required request parameters: [creditScore, monthlyExpenses, grossIncome, employmentStatus, age]',
      },
      response: expect.objectContaining({
        status: 400,
        statusText: 'Bad Request',
      }),
    });
  });
  it('responds with a 200 Complete given the user is authenticated provides the required query params', async () => {
    await expect(
      apiClient.GET('/borrowingCapacity', {
        headers: {
          authorization: apiToken,
        },
        params: {
          query: {
            age: 20,
            creditScore: 500,
            employmentStatus: 'CASUAL',
            grossIncome: 100000,
            monthlyExpenses: 2000,
          },
        },
      })
    ).resolves.toEqual({
      data: {
        estimatedBorrowingCapacity: expect.toBeNumber(),
      },
      response: expect.objectContaining({
        status: 200,
        statusText: 'OK',
      }),
    });
  });
});
