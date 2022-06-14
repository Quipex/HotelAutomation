import bunyan from 'bunyan';

const testsLog = bunyan.createLogger({
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
    }
  ]
});

export { testsLog }
