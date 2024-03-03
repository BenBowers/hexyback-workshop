import { Config } from 'sst/node/config';

export const isUserAuthorized = (authorizationToken: string) =>
  authorizationToken === Config.API_KEY;
