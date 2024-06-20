import { FromSchema, JSONSchema } from 'json-schema-to-ts';

export type createBorrowerProfile = FromSchema<
  typeof createBorrowerProfileSchema
>;

const createBorrowerProfileSchema = {
  type: 'object',
  required: ['name', 'dob', 'email', 'creditScore'],
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    dob: {
      type: 'string',
      format: 'date',
    },
    creditScore: {
      type: 'integer',
      minimum: 0,
      maximum: 1000,
    },
  },
} as const satisfies JSONSchema;

export type BorrowerPorfileCreatedEventSource = FromSchema<
  typeof borrowerProfileCreatedEventSourceSchema
>;

const borrowerProfileCreatedEventSourceSchema = {
  $id: 'https://benbowers.github.io/hexyback-workshop/schemas/borrower-profile-created-event-source',
  const: 'use-cases/create-borrowing-profile/create-borrower-profile',
} as const satisfies JSONSchema;

export type BorrowerProfileCreatedEventDetail = FromSchema<
  typeof borrowerProfileCreatedEventDetailSchema
>;

export const borrowerProfileCreatedEventDetailSchema = {
  $id: 'https://benbowers.github.io/hexyback-workshop/schemas/borrower-profile-created-event-detail',
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    id: { type: 'string', format: 'uuid' },
  },
} as const satisfies JSONSchema;

export type BorrowerProfileCreatedEventDetailType = FromSchema<
  typeof borrowerProfileCreatedEventDetailTypeSchema
>;

const borrowerProfileCreatedEventDetailTypeSchema = {
  $id: 'https://benbowers.github.io/hexyback-workshop/schemas/borrower-profile-created-event-detail-type',
  const: 'BorrowerProfileCreated',
} as const satisfies JSONSchema;

export type BorrowerProfileCreatedEvent = FromSchema<
  typeof borrowerProfileCreatedEventSchema
>;

const borrowerProfileCreatedEventSchema = {
  $id: 'https://benbowers.github.io/hexyback-workshop/schemas/borrower-profile-created-event',
  type: 'object',
  required: [
    'version',
    'id',
    'detail-type',
    'source',
    'account',
    'time',
    'region',
    'detail',
  ],
  properties: {
    version: {
      type: 'string',
    },
    id: {
      type: 'string',
      format: 'uuid',
    },
    'detail-type': {
      $ref: 'https://benbowers.github.io/hexyback-workshop/schemas/borrower-profile-created-event-detail-type',
    },
    source: {
      $ref: 'https://benbowers.github.io/hexyback-workshop/schemas/borrower-profile-created-event-source',
    },
    account: {
      type: 'string',
      pattern: '^[0-9]{12}$',
    },
    time: {
      type: 'string',
      format: 'date-time',
    },
    region: {
      enum: [
        'us-east-1',
        'us-east-2',
        'us-west-1',
        'us-west-2',
        'ca-central-1',
        'eu-west-1',
        'eu-central-1',
        'eu-west-2',
        'eu-west-3',
        'eu-north-1',
        'ap-northeast-1',
        'ap-northeast-2',
        'ap-southeast-1',
        'ap-southeast-2',
        'ap-south-1',
        'sa-east-1',
        'us-gov-west-1',
        'us-gov-east-1',
      ],
    },
    detail: {
      $ref: 'https://benbowers.github.io/hexyback-workshop/schemas/borrower-profile-created-event-detail',
    },
  },
} as const satisfies JSONSchema;
