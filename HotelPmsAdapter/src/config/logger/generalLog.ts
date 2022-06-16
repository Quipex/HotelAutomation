import bunyan from 'bunyan';
import { enhanceLoggerWithRequestId } from '~/common/utils/logging';

const log = enhanceLoggerWithRequestId(bunyan.createLogger({
  name: 'General',
  src: process.env.NODE_ENV !== 'prod',
  srcDepth: 4,
  streams: [
    {
      level: 'debug',
      path: 'logs/app/debug.log',
      period: '1d',
      type: 'rotating-file',
      count: 2
    },
    {
      level: process.env.NODE_ENV === 'dev' ? 'debug' : 'info',
      stream: process.stdout
    },
    {
      level: 'info',
      path: 'logs/app/info+.log',
      type: 'rotating-file',
      period: '1d',
      count: 3
    },
    {
      level: 'error',
      path: 'logs/app/errors.log',
      type: 'rotating-file',
      period: '1d',
      count: 30
    }
  ]
}));

export { log };
