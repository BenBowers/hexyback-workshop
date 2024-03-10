import 'sst/node/config';

declare module 'sst/node/config' {
  export interface ConfigTypes {
    API_ENDPOINT: string;
    API_KEY: string;
    FINANCIAL_DATA_TABLE_NAME: string;
  }
}
