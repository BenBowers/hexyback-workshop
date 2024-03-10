import * as fs from 'fs';
import {
  GenerateApiDependencies,
  generateApiSpec,
} from '../infra/api-definition';
import { generateApiSpec as generateCreditScoreServiceApiSpec } from '../infra/credit-score-service-api-definition';

const apiSpec = generateApiSpec({} as GenerateApiDependencies);
const creditScoreServiceApiSpec = generateCreditScoreServiceApiSpec('', '');

fs.writeFileSync('openapi/spec.json', JSON.stringify(apiSpec, null, 2));

console.log('API specification object has been written to api-spec.json');

fs.writeFileSync(
  'openapi/credit-score-service-api-spec.json',
  JSON.stringify(creditScoreServiceApiSpec, null, 2)
);

console.log(
  'Credit Score Service API specification object has been written to credit-score-service-api-spec.json'
);
