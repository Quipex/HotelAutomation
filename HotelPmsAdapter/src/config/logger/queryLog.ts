import bunyan from 'bunyan';

const queryLog = bunyan.createLogger({
  name: 'Orm_Queries',
  src: process.env.NODE_ENV !== 'prod',
  streams: [
    {
      level: 'debug',
      path: 'logs/db/debug.log',
      type: 'rotating-file',
      period: '1d',
      count: 30
    },
    {
      level: 'info',
      path: 'logs/db/info.log',
      type: 'rotating-file',
      period: '1d',
      count: 30
    },
    {
      level: 'warn',
      path: 'logs/db/slow.log',
      type: 'rotating-file',
      period: '1d',
      count: 30
    },
    {
      level: 'error',
      path: 'logs/db/errors.log',
      type: 'rotating-file',
      period: '1d',
      count: 30
    },
    {
      level: process.env.NODE_ENV !== 'prod' ? 'debug' : 'info',
      stream: process.stdout
    }
  ]
});

export { queryLog };
