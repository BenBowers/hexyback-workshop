import 'sst/node/event-bus';

declare module 'sst/node/event-bus' {
  export interface EventBusResources {
    BorrowerProfile: {
      eventBusName: string;
    };
  }
}
