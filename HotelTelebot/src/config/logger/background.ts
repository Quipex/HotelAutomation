import { createLogger } from 'bunyan';

const backgroundLog = createLogger({
  name: 'Background',
  src: true,
  streams: [
    {
      level: 'debug',
      path: 'logs/background/debug.log',
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
      path: 'logs/background/full.log',
      type: 'rotating-file',
      period: '1d',
      count: 3
    },
    {
      level: 'error',
      path: 'logs/background/errors.log',
      type: 'rotating-file',
      period: '1d',
      count: 30
    }
  ]
});

export { backgroundLog };
