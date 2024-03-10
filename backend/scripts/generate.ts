import * as fs from 'fs';
import {
  GenerateApiDependencies,
  generateApiSpec,
} from '../infra/api-definition';

const apiSpec = generateApiSpec({} as GenerateApiDependencies);

fs.writeFileSync('openapi/spec.json', JSON.stringify(apiSpec, null, 2));

console.log('API specification object has been written to api-spec.json');
