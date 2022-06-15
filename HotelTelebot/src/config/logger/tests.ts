import { createLogger } from 'bunyan';

const testsLog = createLogger({
  name: 'Tests',
  src: true,
  streams: [
    {
      level: 'debug',
      path: 'logs/tests/tests.log',
      period: '1d',
      type: 'rotating-file',
      count: 2
    },
    {
      level: 'debug',
      stream: process.stdout
    },
    {
      level: 'warn',
      stream: process.stderr
    }
  ]
});

export { testsLog };
