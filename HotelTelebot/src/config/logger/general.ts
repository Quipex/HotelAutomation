import { createLogger } from 'bunyan';

const log = createLogger({
  name: 'General',
  src: true,
  streams: [
    {
      level: 'debug',
      path: 'logs/app/debug.log',
      period: '1d',
      type: 'rotating-file',
      count: 2
    },
    {
      level: (process.env.NODE_ENV === 'dev') ? 'debug' : 'info',
      stream: process.stdout
    },
    {
      level: 'warn',
      stream: process.stderr
    },
    {
      level: 'info',
      path: 'logs/app/info.log',
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
});

export { log };
