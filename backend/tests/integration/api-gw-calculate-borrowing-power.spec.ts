import { BorrowingCapacityGetParams } from '@/types/api';
import { paths } from '@openapi';
import openApiFetch from 'openapi-fetch';
import { Config } from 'sst/node/config';
import { describe, it } from 'vitest';
const baseUrl = Config.API_ENDPOINT;
describe.concurrent('api-aw-calculate-borrowing-power', () => {
  const apiClient = openApiFetch<paths>({
    baseUrl: baseUrl,
  });
  it('responds with a 400 Bad Request given the user does not provide the required query params', async ({
    expect,
  }) => {
    {
      await expect(
        apiClient.GET('/borrowingCapacity', {
          params: {
            query: {} as BorrowingCapacityGetParams,
          },
        })
      ).resolves.toEqual({
        error: {
          message:
            'Missing required request parameters: [grossIncome, employmentStatus, age]',
        },
        response: expect.objectContaining({
          status: 400,
          statusText: 'Bad Request',
        }),
      });
    }
  });
  it('responds with a 200 Complete given the user provides the required query params', async ({
    expect,
  }) => {
    await expect(
      apiClient.GET('/borrowingCapacity', {
        params: {
          query: {
            age: 20,
            employmentStatus: 'CASUAL',
            grossIncome: 1000,
          },
        },
      })
    ).resolves.toEqual({
      data: {
        estimatedBorrowingCapacity: 216,
      },
      response: expect.objectContaining({
        status: 200,
        statusText: 'OK',
      }),
    });
  });
});
