import bunyan from 'bunyan';

const testsLog = bunyan.createLogger({
  name: 'Tests',
  streams: [
    {
      level: 'debug',
      path: 'logs/app/tests.log',
      period: '1d',
      type: 'rotating-file',
      count: 2
    },
    {
      level: 'debug',
      stream: process.stdout
    }
  ]
});

export { testsLog };
