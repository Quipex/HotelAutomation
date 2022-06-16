import bunyan from 'bunyan';

const queryLog = bunyan.createLogger({
  name: 'Orm_Queries',
  src: process.env.NODE_ENV !== 'prod',
  streams: [
    {
      level: 'info',
      path: 'logs/db/all.log',
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
      level: 'info',
      stream: process.stdout
    }
  ]
});

export { queryLog };
