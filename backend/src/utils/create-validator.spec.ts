import { JSONSchema } from 'json-schema-to-ts';
import { describe, expect, it } from 'vitest';
import { createValidator } from './create-validator';

describe('create-validator', () => {
  it('given a schema it creates validator for the supplied schema', () => {
    const schema = {
      $id: 'https://foobar.com/schemas/bongo',
      type: 'object',
      properties: {
        emailAddy: {
          type: 'string',
          format: 'email',
        },
        name: {
          type: 'string',
        },
        dob: {
          type: 'string',
          format: 'date',
        },
        id: { type: 'string', format: 'uuid' },
      },
    } as const satisfies JSONSchema;
    const entityToValidate = {
      emailAddy: 'you@me.com',
      name: 'Milso Jillson',
      dob: '1981-06-30',
      id: '56e331f0-3e8d-4025-aa84-baaefa187abe',
    };
    const schemaValidator = createValidator(schema);
    const isValid = schemaValidator(entityToValidate);
    expect(isValid).toBeTruthy();
  });
});
