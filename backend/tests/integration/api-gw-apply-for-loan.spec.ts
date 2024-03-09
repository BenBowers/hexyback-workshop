import { ApplyForLoanRequestBody } from '@/types/api';
import { paths } from '@openapi';
import openApiFetch from 'openapi-fetch';
import { Config } from 'sst/node/config';
import { describe, expect, it } from 'vitest';
const baseUrl = Config.API_ENDPOINT;
const apiToken = Config.API_KEY;
describe.concurrent('api-aw-apply-for-loan', () => {
  const apiClient = openApiFetch<paths>({
    baseUrl: baseUrl,
  });
  it('responds with a 400 Bad Request given the user is authenticated but does not provide the required request body', async () => {
    await expect(
      apiClient.POST('/loan', {
        headers: {
          authorization: apiToken,
        },
        body: {} as unknown as ApplyForLoanRequestBody,
      })
    ).resolves.toEqual({
      error: {
        message: 'Invalid request body',
      },
      response: expect.objectContaining({
        status: 400,
        statusText: 'Bad Request',
      }),
    });
  });
  it('responds with a 200 Complete given the user is authenticated provides the required request body', async () => {
    await expect(
      apiClient.POST('/loan', {
        headers: {
          authorization: apiToken,
        },
        body: {
          monthlyExpenses: 500,
          creditScore: 700,
          age: 20,
          employmentStatus: 'FULL_TIME',
          grossIncome: 100000,
        },
      })
    ).resolves.toEqual({
      data: {
        loanApplicationStatus: 'APPROVED',
      },
      response: expect.objectContaining({
        status: 200,
        statusText: 'OK',
      }),
    });
  });
});
