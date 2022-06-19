import bunyan from 'bunyan';
import { enhanceLoggerWithRequestId } from '~/common/utils/logging';

const wipLog = enhanceLoggerWithRequestId(bunyan.createLogger({
  name: 'Needs_Attention',
  src: process.env.NODE_ENV !== 'prod',
  srcDepth: 4,
  streams: [
    {
      level: 'info',
      path: 'logs/wip/needs_attention.log',
      type: 'rotating-file',
      period: '1d',
      count: 30
    },
    {
      level: 'info',
      stream: process.stdout
    }
  ]
}));

export { wipLog };
