import { aws_lambda as lambda } from 'aws-cdk-lib';
import { SSTConfig } from 'sst';
import { ConfigStack } from './infra/ConfigStack';
const LAMBDA_INSIGHTS_ARN =
  'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension-Arm64:5';
export default {
  config() {
    return {
      name: 'hexyback-workshop',
      region: 'ap-southeast-2',
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: 'nodejs20.x',
      insightsVersion:
        lambda.LambdaInsightsVersion.fromInsightVersionArn(LAMBDA_INSIGHTS_ARN),
      logRetention: 'one_month',
      tracing: 'active',
      architecture: 'arm_64',
      nodejs: {
        esbuild: {
          keepNames: false,
          minify: true,
          external: process.env.IS_LOCAL ? ['@aws-sdk/*'] : undefined,
        },
      },
    });
    app.stack(ConfigStack);
  },
} satisfies SSTConfig;
