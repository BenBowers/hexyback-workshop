import { isUserAuthorized } from '@/use-cases/is-user-authorized';
import { APIGatewayAuthorizerHandler } from 'aws-lambda';

export const handler: APIGatewayAuthorizerHandler = async (event) => {
  if (event.type === 'TOKEN' && event.authorizationToken) {
    const userAuthorized = isUserAuthorized(event.authorizationToken);
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: userAuthorized ? 'Allow' : 'Deny',
            Resource: event.methodArn,
          },
        ],
      },
    };
  }
  throw 'Unauthorized';
};
