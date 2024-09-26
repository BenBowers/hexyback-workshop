import * as fs from 'fs';
import { generateEventBridgeSchema } from '../infra/generate-event-bridge-schema';

const eventBridgeSchema = generateEventBridgeSchema();

fs.writeFileSync('openapi/event-bridge-schema.json', JSON.stringify(eventBridgeSchema, null, 2));

console.log('Event Bridge Schema was written to  open-api/event-bridge-schema.json');
