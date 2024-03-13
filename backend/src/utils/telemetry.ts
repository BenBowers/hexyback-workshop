import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';

let tracer: Tracer | undefined;
let logger: Logger | undefined;

export const getTracer = (serviceName?: string): Tracer => {
  if (!tracer) {
    tracer = new Tracer({
      serviceName,
      captureHTTPsRequests: true,
      enabled: true,
    });
  }
  return tracer;
};
export const getLogger = (serviceName?: string): Logger => {
  if (!logger) {
    logger = new Logger({ serviceName });
  }
  return logger;
};

export const Log = {
  error: (message: string) => {
    if (logger) {
      logger.error(message);
    }
  },
  info: (message: string) => {
    if (logger) {
      logger.info(message);
    }
  },
};
