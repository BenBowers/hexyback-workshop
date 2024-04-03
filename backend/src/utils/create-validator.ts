import { JSONSchema } from 'json-schema-to-ts';
import { getAjvClient } from './get-ajv-client';

export const createValidator = (schema: JSONSchema) =>
  getAjvClient().compile(schema);
