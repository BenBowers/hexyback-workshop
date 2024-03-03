import { isUserAuthorized } from '@/use-cases/is-user-authorized';
import { APIGatewayRequestAuthorizerEvent, Context } from 'aws-lambda';
import { beforeEach } from 'node:test';
import { describe, expect, it, vi } from 'vitest';
import { handler } from './api-gw-authorizer';

describe('api-authorizer', () => {
  vi.mock('@/use-cases/is-user-authorized', () => ({
    isUserAuthorized: vi.fn(),
  }));
  const isUserAuthorizedSpy = vi.mocked(isUserAuthorized);
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe('Given the request contains an authorization token', () => {
    it('calls the is user authorized use case with the  authorization token', async () => {
      await handler(
        {
          type: 'TOKEN',
          authorizationToken: 'abc',
          methodArn:
            'arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/dev/GET/',
        } as unknown as APIGatewayRequestAuthorizerEvent,
        {} as Context,
        () => {}
      );
      expect(isUserAuthorizedSpy).toHaveBeenCalledOnce();
      expect(isUserAuthorizedSpy).toHaveBeenCalledWith('abc');
    });
    describe('Given the is user authorized use case returns true', () => {
      it('will resolve to a policy that allows invocation of the desired endpoint', async () => {
        isUserAuthorizedSpy.mockReturnValue(true);
        await expect(
          handler(
            {
              type: 'TOKEN',
              authorizationToken: 'abc',
              methodArn:
                'arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/dev/GET/',
            } as unknown as APIGatewayRequestAuthorizerEvent,
            {} as Context,
            () => {}
          )
        ).resolves.toEqual({
          policyDocument: {
            Statement: [
              {
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource:
                  'arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/dev/GET/',
              },
            ],
            Version: '2012-10-17',
          },
          principalId: 'user',
        });
      });
    });
    describe('Given the is user authorized use case returns false', () => {
      it('will resolve to a policy that denies invocation of the desired endpoint', async () => {
        isUserAuthorizedSpy.mockReturnValue(false);
        await expect(
          handler(
            {
              type: 'TOKEN',
              authorizationToken: 'token',
              methodArn:
                'arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/dev/GET/',
            } as unknown as APIGatewayRequestAuthorizerEvent,
            {} as Context,
            () => {}
          )
        ).resolves.toEqual({
          policyDocument: {
            Statement: [
              {
                Action: 'execute-api:Invoke',
                Effect: 'Deny',
                Resource:
                  'arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/dev/GET/',
              },
            ],
            Version: '2012-10-17',
          },
          principalId: 'user',
        });
      });
    });
  });
  describe('Given the request contains no authorization token', () => {
    it('rejects with unauthorized', async () => {
      await expect(
        handler(
          {
            type: 'TOKEN',
            methodArn:
              'arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/dev/GET/',
          } as unknown as APIGatewayRequestAuthorizerEvent,
          {} as Context,
          () => {}
        )
      ).rejects.toEqual('Unauthorized');
    });
  });
});
