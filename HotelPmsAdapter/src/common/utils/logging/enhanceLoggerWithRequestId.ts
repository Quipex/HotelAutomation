import { appendRequestIdIfPresent } from './appendRequestIdIfPresent';

type LoggingFn = (message: string, parameters?: any) => void;

function enhanceLoggerWithRequestId(logger) {
  return {
    trace: (message, ...args): LoggingFn => logger.trace(appendRequestIdIfPresent(message), ...args),
    debug: (message, ...args): LoggingFn => logger.debug(appendRequestIdIfPresent(message), ...args),
    info: (message, ...args): LoggingFn => logger.info(appendRequestIdIfPresent(message), ...args),
    warn: (message, ...args): LoggingFn => logger.warn(appendRequestIdIfPresent(message), ...args),
    error: (message, ...args): LoggingFn => logger.error(appendRequestIdIfPresent(message), ...args)
  };
}

export { enhanceLoggerWithRequestId };
